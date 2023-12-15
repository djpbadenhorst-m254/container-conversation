const { jsonLogic } = require('./jsonLogic.js');
const { pocWhatsappBot } = require('./pocWhatsappBot.js');
const { pocSmsBot } = require('./pocSmsBot.js');
const { finqual } = require('./finqual');

module.exports={
  jsonLogic: jsonLogic,
  BOTCONFIG: [
    ...pocSmsBot,
    ...pocWhatsappBot,
    ...finqual,
    //{ code: 'CLOSED' },
  ],
};
