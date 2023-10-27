const clients = require('../src/clients');
const { determineAction } = require('../src/action');
const outgoing = require('./outgoing.js');

let process = async (data) => {
  let speaker = await clients.getSpeaker(data);
  let conversations = await clients.getConversationsBySpeakerId(speaker.id,['active']);

  // Select relevant conversation or create one
  let selConv;
  if (data.message.toLowerCase()=='hi') {
    if (conversations.length > 0) {
      await Promise.all(conversations.map(conv =>
	clients.updateConversation(conv.id, {status:'closed'})
      ));
    }
    await clients.createConversation(speaker.id);
    conversations = await clients.getConversationsBySpeakerId(speaker.id,['active']);
  }
  if (conversations===undefined || conversations.length==0)
    return undefined;
  selConv = conversations[0];
  
  // Log response
  clients.logResponse({
    timestamp: new Date(),
    speakerId: speaker.id,
    conversationId: selConv.id,
    conversationCode: selConv.last_interaction_code  ,
    channel: 'SMS',
    payload: {message: data.message},
  });
  
  // Determine and execute action
  return determineAction({
    speakerId: speaker.id,
    prevCode: selConv.last_interaction_code,
    incMessage: data.message,
  }).then(async action => {
    if (action.outChannel == 'SMS' && action.outMessage!==undefined) {
      await clients.updateConversation(selConv.id, {last_interaction_code:action.nextCode});
      if (action.nextCode=='CLOSED')
	clients.updateConversation(selConv.id, {status:'closed'});
      await outgoing.sendSms({
	from: '25412',
	to: speaker.phone_number, 
	message: action.outMessage,
      });
    }
  });
};

module.exports={
  process:process,
};
