const { pocBotConfig, jsonLogic } = require('../config');
const clients = require('../clients');
const nunjucks = require('nunjucks');
const _ = require('lodash');

const determineAction = async ({speakerId, prevCode, incMessage}) => {
  let subConfig = pocBotConfig.filter(x=>(x.code==prevCode));
  if (subConfig.length==0)
    new Error('No config options found');
  else if (subConfig.length>1)
    new Error('Too many config options found');
  subConfig = subConfig[0];

  let action = subConfig.responses.filter(x=>{
    return jsonLogic.apply(x.check, {incMessage: incMessage});
  })[0];
  
  // Update speaker data
  let speakerData = (await clients.getSpeakerData(speakerId)) || {};
  if (action.store !== undefined) {
    speakerData = {
      ...speakerData,
      ..._.map(action.store, (value, key)=>
	({[key]: jsonLogic.apply(value, {
	  incMessage: incMessage,
	  ...speakerData
	})})
      ).reduce((a,b)=>({...b,...a}),{})
    };
    await clients.updateSpeakerData(speakerId, speakerData);
  }

  // Determine outgoing message
  let outMessage = pocBotConfig.filter(x=>(x.code==action.nextCode));
  if (outMessage.length==0)
    new Error('No config options found');
  else if (outMessage.length>1)
    new Error('Too many config options found');
  outMessage = outMessage[0]?.outMessage;
  if (outMessage)
    outMessage = nunjucks.renderString(outMessage, speakerData);
  
  return {
    nextCode: action.nextCode,
    outChannel: 'SMS',
    outMessage: outMessage,
  };
};

module.exports={
  determineAction: determineAction
};
