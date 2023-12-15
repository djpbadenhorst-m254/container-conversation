const _ = require('lodash');
const { getKnex } = require('./knex.js');

const getSpeaker = ({
  speakerId,
  whatsappUserId, facebookUserId,
  lgpLeadId, appUserId,
  phoneNumber, email, webUserId
}) => {
  let db = getKnex();
  let query = {};
  if (speakerId) {
    query = {speaker_id: speakerId};
  } else if (phoneNumber) {
    query = {phone_number: phoneNumber};
  } else if (email) {
    query = {email: email};
  } else if (appUserId) {
    query = {app_user_id: appUserId};
  } else if (lgpLeadId) {
    query = {lgp_lead_id: lgpLeadId};
  } else if (whatsappUserId) {
    query = {whatsapp_user_id: whatsappUserId};
  } else if (facebookUserId) {
    query = {facebook_user_id: facebookUserId};
  } else if (webUserId) {
    query = {web_user_id: webUserId};
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
    let data = {speaker_id: speakerId, status: 'active'};//, last_interaction_code: 'INIT'
    return db('conversations').insert([data])
      .then(x=>db('conversations').where(data).first());
  } else {
    throw new Error('No Speaker Id');
  }
};
const getConversationsBySpeakerId = async (speakerId, allowedStatus=[]) => {
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
const getIncoming = (channelId) => {
  let db = getKnex();
  return db('incoming').where({channel_id:channelId}).select('*');
};
const logIncoming = (data) => {
  data = {
    ts: data.timestamp,
    conversation_id: data.conversationId,
    channel: data.channel,
    channel_id: data.channelId,
    status: data.status,
    payload: data.payload,
    conversation_code: data.conversationCode,
  };
  let db = getKnex();
  return db('incoming').insert([data]);
};
const logOutgoing = (data) => {
  data = {
    ts: data.timestamp,
    conversation_id: data.conversationId,
    channel: data.channel,
    channel_id: data.channelId,
    status: data.status,
    payload: data.payload,
    conversation_code: data.conversationCode,
  };
  let db = getKnex();
  return db('outgoing').insert([data]);
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
const clearSpeakerData = (speakerId) => {
  let db = getKnex();
  return getSpeakerData(speakerId).then(speakerData=>{
    if (speakerData) {
      return db('speaker_data')
        .update({speaker_data: JSON.stringify({phone_number: speakerData['phone_number']})})
        .where({speaker_id: speakerId});
    } else
      return undefined;
  });
};
const updateOutgoing = (channelId, data) => {
  let db = getKnex();
  return db('outgoing')
    .update(data)
    .where({channel_id: channelId})
    .then(x=>db('outgoing').where({channel_id: channelId}))
    .then(x=>x[0]);
};

module.exports={
  getSpeaker: getSpeaker,
  createConversation: createConversation,
  getConversationsBySpeakerId: getConversationsBySpeakerId,
  updateConversation: updateConversation,
  getIncoming: getIncoming,
  logIncoming: logIncoming,
  logOutgoing: logOutgoing,
  getSpeakerData: getSpeakerData,
  updateSpeakerData: updateSpeakerData,
  clearSpeakerData: clearSpeakerData,
  updateOutgoing: updateOutgoing,
};
