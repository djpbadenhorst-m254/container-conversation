const AfricasTalking = require('africastalking');

const sendSms = (data) => {
  console.log('here');
  console.log(data);
  if (!(data.to && data.from && data.message))
    throw Error('Insufficient parameters specified');

  console.log(process.env['AFRICAS_TALKING_API_KEY']);
  console.log(process.env['AFRICAS_TALKING_USERNAME']);
  const atClient = AfricasTalking({
    apiKey: process.env['AFRICAS_TALKING_API_KEY'], 
    username: process.env['AFRICAS_TALKING_USERNAME']
  });
  console.log(data);
  return atClient.SMS.send(data);
}

module.exports = {
  sendSms:sendSms
};
