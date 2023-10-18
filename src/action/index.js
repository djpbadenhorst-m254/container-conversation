const { botConfig } = require('../config');

const action = async ({speakerId, prevInteractionCode, message, channel}) => {
  prevInteractionCode = prevInteractionCode || 'INIT';

  let subConfig = botConfig.filter(x=> (x.code==prevInteractionCode && x.channel==channel))
  if (subConfig.length==0)
    new Error('No config options found');
  else if (subConfig.length>1)
    new Error('Too many config options found');
  subConfig = subConfig[0]

  subConfig.responses.filter(x=>{
    
  });
  console.log(subConfig);
};

module.exports={
  action: action
};
