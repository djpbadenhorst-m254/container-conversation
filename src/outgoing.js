const AfricasTalking = require('africastalking');

const sendSms = (data) => {
  if (!(data.to && data.from && data.message))
    throw Error('Insufficient parameters specified');

  const atClient = AfricasTalking({
    apiKey: process.env['AFRICAS_TALKING_API_KEY'], 
    username: process.env['AFRICAS_TALKING_USERNAME']
  });
  return atClient.SMS.send(data);
}

module.exports = {
  sendSms:sendSms
};
