const m254Utils = require('m254-utils');
const logger = m254Utils.logger;
const CODES = m254Utils.CONSTANTS.CODES;

const clients = require('../src/clients');
const outgoing = require('./outgoing.js');
const action = require('../src/action');

const selectConversation = async (speakerId, incMessage, incChannel) => {
  if ( incMessage=='RESET' ) {
    let db = clients.getKnex();
    let conversation = await db('conversations').where('speaker_id',speakerId);

    await db('incoming').whereIn('conversation_id',conversation.map(x=>x.id)).del();
    await db('outgoing').whereIn('conversation_id',conversation.map(x=>x.id)).del();
    await db('conversations').where('speaker_id',speakerId).del();
    await db('speaker_data').where('speaker_id', speakerId).del();
    await db('speakers').where('id',speakerId).del();
    return undefined;
  }

  let conversations = await clients.getConversationsBySpeakerId(speakerId);
  let isNewUser = (conversations.length==0);
  conversations = conversations.filter(x=>x.status=='active');
  
  switch (incChannel) {
  case 'SMS':
    if (incMessage.toLowerCase().trim()=='hi') {
      if (conversations.length > 0) {
	await clients.clearSpeakerData(speakerId);
	await Promise.all(conversations.map(conv =>
	  clients.updateConversation(conv.id, {status:'closed'})
	));
      }
      return clients.createConversation(speakerId).then(conv=>{
	let data = {
	  latest_outgoing_code:'INIT',
	  latest_outgoing_ts: new Date()
	};
	if (!isNewUser)
	  data.latest_outgoing_code = 'INIT_RETURN';
	return clients.updateConversation(conv.id, data);
      });
    }
    else {
      if (conversations===undefined || conversations.length==0)
	return undefined;
      return conversations[0];
    }
    break;
    
  case 'WHATSAPP':
    if (incMessage.toLowerCase().trim()=='finqual hi') {
      if (conversations.length > 0) {
	await clients.clearSpeakerData(speakerId);
	await Promise.all(conversations.map(conv =>
	  clients.updateConversation(conv.id, {status:'closed'})
	));
      }
      return clients.createConversation(speakerId).then(conv=>{
	let data = {
	  latest_outgoing_code:'WAP/FINQUAL/INIT_WITH_MESSAGE',
	  latest_outgoing_ts: new Date()
	};
	//if (!isNewUser)
	//  data.latest_outgoing_code = 'INIT_RETURN';
	return clients.updateConversation(conv.id, data);
      });
    }
    else {
      if (conversations===undefined || conversations.length==0) {
	/*
	  return clients.createConversation(speakerId).then(conv=>{
	  let data = {
	  latest_outgoing_code:'INIT',
	  latest_outgoing_ts: new Date()
	  };
	  if (!isNewUser)
	  data.latest_outgoing_code = 'INIT_RETURN';
	  return clients.updateConversation(conv.id, data);
	  });
	*/
	return undefined;
      } else 
      return conversations[0];
    }
    break;
    
  default:
    throw new Error('Invalid channel');
  }
};
const processIncoming = async (data) => {
  // Obtain speaker and relevant conversation
  let speaker = await clients.getSpeaker(data);
  logger.debug('Speaker found', {tags:[
    CODES.CHK.CNV.FUNC.PROCESS_INCOMING.SPEAKER_FOUND
  ], data: speaker});
  let selectedConversation = await selectConversation(speaker.id, data.message, data.channel);

  // No valid conversation
  if (selectedConversation===undefined) {
    logger.debug('No conversation found', {tags:[
      CODES.CHK.CNV.FUNC.PROCESS_INCOMING.NO_CONVERSATION
    ]});
    return undefined;
  }
  logger.debug('Conversation selected', {tags:[
    CODES.CHK.CNV.FUNC.PROCESS_INCOMING.CONVERSATION_PAYLOAD
  ], data: selectedConversation});
  
  // Log incoming message
  if (data.channelId != 'simulated') {
    //let message = await clients.getIncoming(data.channelId);
    //if (message.length>0)
    //  return undefined;
    
    await clients.logIncoming({
      timestamp: new Date(),
      conversationId: selectedConversation.id,
      channel: data.channel,
      channelId: data.channelId,
      status: 'received',
      payload: {message: data.message},
      conversationCode: selectedConversation.latest_outgoing_code,
    });
  }
  await clients.updateConversation(
    selectedConversation.id, {
      latest_incoming_ts: new Date(),
    }
  );
  
  // Determine and execute action
  return action.determineAction({
    speakerId: selectedConversation.speaker_id,
    prevCode: selectedConversation.latest_outgoing_code,
    incMessage: data.message,
    incChannel: data.channel,
  }).then(async result => {
    await clients.updateConversation(
      selectedConversation.id, {
	latest_outgoing_code: result.nextCode,
	latest_outgoing_ts: new Date()
      }
    );

    if (result.outMessage===undefined) {
      logger.debug('No action required', {tags:[
	CODES.CHK.CNV.FUNC.PROCESS_INCOMING.NO_ACTION_REQUIRED
      ], data: selectedConversation});
      return undefined;
    }

    if (result.closeConversation==true) {
      logger.debug('Conversation Closed', {tags:[
	CODES.CHK.CNV.FUNC.PROCESS_INCOMING.CONVERSATION_CLOSED
      ], data: selectedConversation});
      await clients.updateConversation( selectedConversation.id, { status: 'closed' });
      await clients.clearSpeakerData(speaker.id);
    }
    
    logger.debug('Action Payload', {tags:[
      CODES.CHK.CNV.FUNC.PROCESS_INCOMING.ACTION_PAYLOAD
    ], data: result});

    return {
      speaker: speaker,
      conversation: selectedConversation,
      data: result
    };
  });
};

module.exports={
  selectConversation: selectConversation,
  processIncoming: processIncoming,
};
