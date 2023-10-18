const clients = require('../src/clients');
const { action } = require('../src/action');

let process = async (data) => {  
  let speaker = await clients.getSpeaker(data);
  let conversations = await clients.getSpeakerConversations(speaker.id);
  
  let selectedConversation = conversations[conversations.length-1];
  
  action({
    speakerId: selectedConversation.speaker_id,
    conversationStatus: selectedConversation.status,
    tsLastInteraction: selectedConversation.ts_last_interaction,
    lastInteractionCode: selectedConversation.last_interaction_code,
    message: data.message,
  });
};

module.exports={
  process:process,
};
