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

  return db('speakers').where(query).select('id').then(speakers=>{
    if (speakers.length==0) {
      return db('speakers').insert([query]).then(x=>{
	return db('speakers').where(query).select('id').first();
      });
    } else if (speakers.length==1) {
      return speakers[0];
    } else {
      throw new Error('Multiple speakers');
    }
  });
};
const getSpeakerConversations = (speakerId, allowedStatus=[]) => {
  let db = getKnex();
  if (speakerId) {
    let data = {speaker_id: speakerId};
    let result = db('conversations').where(data);

    if (allowedStatus.length!=0)
      result = result.whereIn('status',allowedStatus);
    
    result = result.orderBy('ts_created', 'asc');
    return result.then(conversations => {
      if (conversations.length==0)
	return db('conversations').insert([{status:'active', ...data}]).then(x=>{
	  result = db('conversations').where(data);
	  
	  if (allowedStatus.length!=0)
	    result = result.whereIn('status',allowedStatus);
	  
	  return result;
	});
      else
	return conversations;
    });
  } else {
    throw new Error('No Speaker Id');
  }
};
const getConversation = (conversationId) => {
  let db = getKnex();
  if (conversationId) {
    return db('conversations').where({id: conversationId});
  } else {
    throw new Error('No Conversation Id');
  }
};
const updateConversation = (conversationId, data) => {
  let db = getKnex();
  return db('conversations')
    .update(data)
    .where({id: conversationId});
};

const getSpeakerData = (speakerId) => {
  let db = getKnex();
  return db('speaker_data').where({speaker_id:speakerId}).select('*')
    .then(x=>x[0]?.speaker_data);
};

const updateSpeakerData = (speakerId, data) => {
  let db = getKnex();
  return getSpeakerData(speakerId).then(speakerData=>{
    if (speakerData)
      return db('speaker_data')
        .update({speaker_data: JSON.stringify(data)})
        .where({speaker_id: speakerId});
    else
      return db('speaker_data').insert([{speaker_id: speakerId, speaker_data:data}])
  });
};

module.exports={
  getSpeaker: getSpeaker,
  getSpeakerConversations: getSpeakerConversations,
  getConversation: getConversation,
  updateConversation: updateConversation,
  getSpeakerData: getSpeakerData,
  updateSpeakerData: updateSpeakerData,
};

/*
const _removeNull = (obj) => _.pickBy(obj, (value, key) => (value !== null) );
const combineSpeakers = async (speakerId1, speakerId2) => {
  let db = getKnex();
  await db('conversations')
    .update({speaker_id: speakerId1})
    .where({speaker_id: speakerId2});
  
  return db('speakers')
    .where('id', speakerId1)
    .then(speaker1 => {
      return db('speakers')
	.where('id', speakerId2)
	.then(speaker2 => {
	  let s1 = _removeNull({...speaker1[0]});
	  let s2 = _removeNull({...speaker2[0]});
	  delete s2.id;

	  let updatedSpeaker = {...s1, ...s2};
	  return db('speakers')
	    .update(updatedSpeaker)
	    .where('id', updatedSpeaker.id)
	    .then(() =>
	      db('speakers').delete().where({id: speakerId2})
	    );
	});
	});

};
*/
