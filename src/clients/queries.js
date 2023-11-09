const _ = require('lodash');
const { getKnex } = require('./knex.js');

const getSpeaker = ({
  speakerId,
  whatsappUserId, facebookUserId,
  lgpLeadId, appUserId,
  phoneNumber, email
}) => {
  let db = getKnex();
  let query = {};
  if (speakerId) {
    query = {speaker_id: speakerId};
  } else if (appUserId) {
    query = {app_user_id: appUserId};
  } else if (lgpLeadId) {
    query = {lgp_lead_id: lgpLeadId};
  } else if (whatsappUserId) {
    query = {whatsapp_user_id: whatsappUserId};
  } else if (facebookUserId) {
    query = {facebook_user_id: facebookUserId};
  } else if (phoneNumber) {
    query = {phone_number: phoneNumber};
  } else {
    throw new Error('Insuficient Ids');
  }

  return db('speakers').where(query).select('*').then(speakers=>{
    if (speakers.length==0) {
      return db('speakers').insert([query]).then(x=>{
	return db('speakers').where(query).select('*').first().then(async speaker=>{
	  await updateSpeakerData(speaker.id, query);
	  return speaker;
	});
      });
    } else if (speakers.length==1) {
      return speakers[0];
    } else {
      throw new Error('Multiple speakers');
    }
  });
};
const createConversation = (speakerId) => {
  let db = getKnex();
  if (speakerId) {
    let data = {speaker_id: speakerId, status: 'active', last_interaction_code: 'INIT'};
    return db('conversations').insert([data])
      .then(x=>db('conversations').where(data).first());
  } else {
    throw new Error('No Speaker Id');
  }
};
const getConversationsBySpeakerId = (speakerId, allowedStatus=[]) => {
  let db = getKnex();
  if (speakerId) {
    let data = {speaker_id: speakerId};
    let result = db('conversations').where(data);

    if (allowedStatus.length!=0)
      result = result.whereIn('status',allowedStatus);
    
    return result.orderBy('ts_created', 'desc');
  } else {
    throw new Error('No Speaker Id');
  }
};
const updateConversation = (conversationId, data) => {
  let db = getKnex();
  return db('conversations')
    .update(data)
    .where({id: conversationId})
    .then(x=>db('conversations').where({id: conversationId}))
    .then(x=>x[0]);
};
const getSpeakerData = (speakerId) => {
  let db = getKnex();
  return db('speaker_data').where({speaker_id:speakerId}).select('*')
    .then(x=>x[0]?.speaker_data);
};
const updateSpeakerData = (speakerId, data={}) => {
  let db = getKnex();
  return getSpeakerData(speakerId).then(speakerData=>{
    if (speakerData) {
      return db('speaker_data')
        .update({speaker_data: JSON.stringify({...speakerData, ...data})})
        .where({speaker_id: speakerId});
    } else
      return db('speaker_data').insert([{speaker_id: speakerId, speaker_data:data}]);
  });
};
const logResponse = (data) => {
  data = {
    ts: data.timestamp,
    speaker_id: data.speakerId,
    conversation_id: data.conversationId,
    channel: data.channel,
    payload: data.payload,
  };
  let db = getKnex();
  return db('responses').insert([data]);
};

module.exports={
  getSpeaker: getSpeaker,
  createConversation: createConversation,
  getConversationsBySpeakerId: getConversationsBySpeakerId,
  updateConversation: updateConversation,
  getSpeakerData: getSpeakerData,
  updateSpeakerData: updateSpeakerData,
  logResponse: logResponse,
};
