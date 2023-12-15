const m254Utils = require('m254-utils');
const logger = m254Utils.logger;
const CODES = m254Utils.CONSTANTS.CODES;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const atClient = require('africastalking')({
  apiKey: process.env['AFRICAS_TALKING_API_KEY'] || '',
  username: process.env['AFRICAS_TALKING_USERNAME'] || '',
});

const clients = require('../src/clients');

const processOutgoing = async ({speaker, conversation, data}) => {
  let log = {
    timestamp: new Date(),
    conversationId: conversation.id,
    channel: data.outChannel,
    status: 'sent',
    payload: {message: data},
    conversationCode: conversation.latest_conversation_code,
  };
  
  switch (data.outChannel) {
  case 'SMS':
    return sendSms({
      from: '25412',
      to: speaker.phone_number, 
      message: data.outMessage,
    }).then(async resp => {
      log = {channelId: resp.SMSMessageData.Recipients[0].messageId, ...log};
      await clients.logOutgoing(log);
      return resp;
    });
    break;
    
  case 'WHATSAPP':
    return sendWhatsapp({
      to: speaker.phone_number, 
      message: data.outMessage,
    }).then(async resp => {
      log = {channelId: resp.messages[0].id, ...log};
      await clients.logOutgoing(log);
      return resp;
    });
    break;
    
  default:
    throw new Error('Invalid channel');
  }
};
const sendSms = (data) => {
  if (!(data.to && data.from && data.message))
    throw new Error('Insufficient parameters specified');
  return atClient.SMS.send(data)
    .then(resp =>{
      logger.debug('Send SMS response', {tags:[
	CODES.CHK.CNV.FUNC.SMS_SEND.SMS_SEND_STATUS
      ], data:{message: resp}});
      return resp;
    });
};
const sendWhatsapp = (data) => {
  if (!(data.to && data.message))
    throw new Error('Insufficient parameters specified');
  
  let url = `https://graph.facebook.com/v17.0/${process.env['WHATSAPP_BUSINESS_ACOUNT_ID']}/messages`;
  let headers = {
    'Authorization': `Bearer ${process.env['WHATSAPP_BUSINESS_ACCESS_TOKEN']}`,
    'Content-Type': 'application/json'
  };
  return fetch(url, {
    method:'post',
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: data.to.replaceAll('+',''),
      ...data.message
    }),
    headers:headers
  }).then(x=>x.json()).then(resp=>{
    logger.debug('Send Whatsapp response', {tags:[
      CODES.CHK.CNV.FUNC.WHATSAPP_SEND.WHATSAPP_SEND_STATUS
    ], data:{message: resp}});
    return resp;
  });
};
const tickWhatsapp = (data) => {
  if (!(data.messageId && data.phoneNumberId))
    throw Error('Insufficient parameters specified');
  
  let url = `https://graph.facebook.com/v18.0/${data.phoneNumberId}/messages`;
  let headers = {
    'Authorization': `Bearer ${process.env['WHATSAPP_BUSINESS_ACCESS_TOKEN']}`,
    'Content-Type': 'application/json'
  };
  return fetch(url, {
    method:'post',
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: data.messageId
    }),
    headers:headers
  }).then(x=>x.json()).then(resp=>{
    logger.debug('Whatsapp marked as read', {tags:[
      CODES.CHK.CNV.FUNC.TICK_WHATSAPP.MARKED_AS_READ
    ], data:{message: resp}});
  }).catch(err=>{
    logger.error('Could not mark Whatsapp as read', {tags:[
      CODES.ERR.CNV.FUNC.TICK_WHATSAPP.FAILED_TO_MARK_AS_READ
    ], data:err.toString()});
  });
};

module.exports = {
  processOutgoing: processOutgoing,
  sendSms:sendSms,
  sendWhatsapp:sendWhatsapp,
  tickWhatsapp: tickWhatsapp,
};
