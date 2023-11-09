const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const atClient = require('africastalking')({
  apiKey: process.env['AFRICAS_TALKING_API_KEY'] || '',
  username: process.env['AFRICAS_TALKING_USERNAME'] || '',
});

const sendSms = (data) => {
  if (!(data.to && data.from && data.message))
    throw new Error('Insufficient parameters specified');
  return atClient.SMS.send(data)
    .then(resp => {
      console.log(resp);
    }).catch(err =>{
      console.log(err);
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
    console.log(resp);
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
    console.log(resp);
  });
};

module.exports = {
  sendSms:sendSms,
  sendWhatsapp:sendWhatsapp,
  tickWhatsapp: tickWhatsapp,
};
