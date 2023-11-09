const m254Utils = require('m254-utils');
const logger = m254Utils.logger;
const CODES = m254Utils.CONSTANTS.CODES;

const clients = require('../src/clients');
const outgoing = require('./outgoing.js');
const { determineAction } = require('../src/action');

const selectConversation = async (speakerId, incMessage, incChannel) => {
  let conversations = await clients.getConversationsBySpeakerId(speakerId);
  let isNewUser = (conversations.length==0);
  conversations = conversations.filter(x=>x.status=='active');
  
  if ( incMessage=='RESET' ) {
    let db = clients.getKnex();
    await db('responses').where('speaker_id',speakerId).del();
    await db('conversations').where('speaker_id',speakerId).del();
    await db('speaker_data').where('speaker_id', speakerId).del();
    await db('speakers').where('id',speakerId).del();
    return undefined;
  }
  
  switch (incChannel) {
  case 'SMS':
    if (incMessage.toLowerCase().trim()=='hi') {
      if (conversations.length > 0) {
	await Promise.all(conversations.map(conv =>
	  clients.updateConversation(conv.id, {status:'closed'})
	));
      }
      return clients.createConversation(speakerId).then(conv=>{
	if (!isNewUser)
	  return clients.updateConversation(conv.id, {last_interaction_code:'INIT_RETURN'});
	return conv;
      });
    }
    else {
      if (conversations===undefined || conversations.length==0)
	return undefined;
      return conversations[0];
    }
    break;
    
  case 'WHATSAPP':
    if (conversations===undefined || conversations.length==0) {
      return clients.createConversation(speakerId).then(conv=>{
	if (!isNewUser)
	  return clients.updateConversation(conv.id, {last_interaction_code:'INIT_RETURN'});
	return conv;
      });
    } else 
      return conversations[0];
    break;
    
  default:
    throw new Error('Invalid channel');
  }
};

const process = async (data) => {
  // Obtain speaker and relevant conversation
  let speaker = await clients.getSpeaker(data);
  let selectedConversation = await selectConversation(speaker.id, data.message, data.channel);

  // Log response
  clients.logResponse({
    timestamp: new Date(),
    speakerId: speaker.id,
    conversationId: selectedConversation.id,
    conversationCode: selectedConversation.last_interaction_code  ,
    channel: data.channel,
    payload: {message: data.message},
  });

  // No valid conversation
  if (selectedConversation===undefined) {
    logger.debug('No conversation found', {tags:[
      CODES.CHK.CNV.FUNC.MID_PROCESS_INCOMING.NO_CONVERSATION
    ]});
    return undefined;
  }
  logger.debug('Conversation selected', {tags:[
    CODES.CHK.CNV.FUNC.MID_PROCESS_INCOMING.CONVERSATION_PAYLOAD
  ], data: selectedConversation});

  // Determine and execute action
  return determineAction({
    speakerId: speaker.id,
    prevCode: selectedConversation.last_interaction_code,
    incMessage: data.message,
    incChannel: data.channel,
  }).then(async action => {
    if (action.outMessage===undefined)
      return undefined;
    
    if (action.nextCode=='CLOSED')
      await clients.updateConversation(
	selectedConversation.id,
	{last_interaction_code: action.nextCode, status: 'closed'}
      );
    else
      await clients.updateConversation(
	selectedConversation.id,
	{last_interaction_code: action.nextCode}
      );
    
    switch (action.outChannel) {
    case 'SMS':
      return outgoing.sendSms({
	from: '25412',
	to: speaker.phone_number, 
	message: action.outMessage,
      });
      break;
      
    case 'WHATSAPP':
      return outgoing.sendWhatsapp({
	to: speaker.phone_number, 
	message: action.outMessage,
      });
      break;
      
    default:
      throw new Error('Invalid channel');
    }
  });
};

module.exports={
  selectConversation: selectConversation,
  process: process,
};
