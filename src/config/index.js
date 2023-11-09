const { jsonLogic } = require('./jsonLogic.js');
const { pocWhatsappBot } = require('./pocWhatsappBot.js');
const { pocSmsBot } = require('./pocSmsBot.js');

module.exports={
  jsonLogic: jsonLogic,
  BOTCONFIG: [
    ...pocSmsBot,
    ...pocWhatsappBot,
    { code: 'CLOSED' },
  ],
};
