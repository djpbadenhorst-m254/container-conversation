const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const AfricasTalking = require('africastalking');

const sendSms = (data) => {
  if (!(data.to && data.from && data.message))
    throw Error('Insufficient parameters specified');

  const atClient = AfricasTalking({
    apiKey: process.env['AFRICAS_TALKING_API_KEY'], 
    username: process.env['AFRICAS_TALKING_USERNAME']
  });
  return atClient.SMS.send(data);
};

const sendWhatsapp = (data) => {
  if (!(data.to && data.message))
    throw Error('Insufficient parameters specified');
  
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
  }).then(x=>x.json());
};

module.exports = {
  sendSms:sendSms,
  sendWhatsapp:sendWhatsapp,
};
