const { BOTCONFIG, jsonLogic } = require('../config');
const clients = require('../clients');
const nunjucks = require('nunjucks');
const flat = require('flat');
const _ = require('lodash');

const determineAction = async ({speakerId, prevCode, incMessage, incChannel}) => {
  let subConfig = BOTCONFIG.filter(x=>(x.code==prevCode && x.incChannel==incChannel));
  if (subConfig.length==0)
    throw new Error('No config options found');
  else if (subConfig.length>1)
    throw new Error('Too many config options found');
  subConfig = subConfig[0];

  let response = subConfig.responses.filter(x=>{
    return jsonLogic.apply(x.check, {incMessage: incMessage});
  })[0];

  // Update speaker data
  let speakerData = (await clients.getSpeakerData(speakerId)) || {};
  if (response.store !== undefined) {
    speakerData = {
      ...speakerData,
      ..._.map(response.store, (value, key)=>
	({[key]: jsonLogic.apply(value, {
	  incMessage: incMessage,
	  ...speakerData
	})})
      ).reduce((a,b)=>({...b,...a}),{})
    };
    await clients.updateSpeakerData(speakerId, speakerData);
  }
  _.each(speakerData, (val,key)=>{
    try { speakerData[key] = JSON.parse(speakerData[key]); } catch (err) {}
  });
  speakerData = _.mapKeys(flat.flatten(speakerData), (val, key)=>key.replaceAll('.','_'));

  // Determine outgoing message
  let nextAction = BOTCONFIG.filter(x=>x.code==response.nextCode);
  if (nextAction.length==0)
    throw new Error('No response code found');
  else if (nextAction.length>1)
    throw new Error('Too many response code found');
  
  let nextCode = nextAction[0]?.code;
  let outChannel = nextAction[0]?.outChannel;
  let outMessage = nextAction[0]?.outMessage;

  if (outChannel=='SMS' && outMessage) 
    outMessage = nunjucks.renderString(outMessage, speakerData);

  if (outChannel=='WHATSAPP' && outMessage?.type=='text' && outMessage.text?.body)
    outMessage.text.body = nunjucks.renderString(outMessage.text.body, speakerData);

  return {
    nextCode: nextCode,
    outChannel: outChannel,
    outMessage: outMessage,
  };
};

module.exports={
  determineAction: determineAction
};
