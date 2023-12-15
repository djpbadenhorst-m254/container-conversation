const m254Utils = require('m254-utils');
const logger = m254Utils.logger;
const CODES = m254Utils.CONSTANTS.CODES;

const { BOTCONFIG, jsonLogic } = require('../config');
const cloneDeep = require('clone-deep');
const clients = require('../clients');
const nunjucks = require('nunjucks');
const flat = require('flat');
const _ = require('lodash');

let nunjucksEnv = nunjucks.configure({noCache: true});

const determineAction = async ({speakerId, prevCode, incMessage, incChannel}) => {
  let BOTCONFIGCOPY = cloneDeep(BOTCONFIG);
  
  // Update speaker data
  let speakerData = (await clients.getSpeakerData(speakerId)) || {};
  logger.debug('Speaker data before additions', {tags:[
    CODES.CHK.CNV.FUNC.DETERMINE_ACTION.SPEAKER_DATA_BEFORE_ADDITIONS
  ], data:speakerData});

  // Obtain current message
  let subConfig = BOTCONFIGCOPY.filter(x=>(x.code==prevCode && x.incChannel==incChannel));
  if (subConfig.length==0)
    throw new Error('No config options found');
  else if (subConfig.length>1)
    throw new Error('Too many config options found');
  subConfig = subConfig[0];

  // Determine response
  let response = subConfig.responses.filter(x=> 
    jsonLogic.apply(x.check, {incMessage: incMessage, ...speakerData})
  )[0];

  // Store new speaker data
  if (response.store !== undefined) {
    speakerData = {
      ...speakerData,
      ..._.map(response.store, (value, key)=>{
	return ({[key]: jsonLogic.apply(value, {
	  incMessage: incMessage,
	  ...speakerData
	})});
      }).reduce((a,b)=>({...b,...a}),{})
    };
    await clients.updateSpeakerData(speakerId, speakerData);
  }
  _.each(speakerData, (val,key)=>{ try { speakerData[key] = JSON.parse(speakerData[key]); } catch (err) {} });
  speakerData = _.mapKeys(flat.flatten(speakerData), (val, key)=>key.replaceAll('.','_'));
  logger.debug('Speaker data after additions', {tags:[
    CODES.CHK.CNV.FUNC.DETERMINE_ACTION.SPEAKER_DATA_AFTER_ADDITIONS
  ], data:speakerData});

  // Determine outgoing message
  let nextAction = BOTCONFIGCOPY.filter(x=>x.code==response.nextCode);
  if (nextAction.length==0)
    throw new Error('No response code found');
  else if (nextAction.length>1)
    throw new Error('Too many response code found');

  // Extract necessary variables
  let nextCode = nextAction[0]?.code;
  let outChannel = nextAction[0]?.outChannel;
  let outMessage = nextAction[0]?.outMessage;
  let closeConversation = nextAction[0]?.closeConversation===true;
  let delayedAction = nextAction[0]?.delayedAction;

  if (outChannel=='SMS' && outMessage) 
    outMessage = nunjucksEnv.renderString(outMessage, speakerData);

  if (outChannel=='WHATSAPP' && outMessage?.type=='text'
      && outMessage.text?.body)
    outMessage.text.body = nunjucksEnv.renderString(outMessage.text.body, speakerData);

  if (outChannel=='WHATSAPP' && outMessage?.type=='interactive'
      && outMessage.interactive?.body?.text)
    outMessage.interactive.body.text = nunjucksEnv.renderString(
      outMessage.interactive.body.text, speakerData
    );

  if (outChannel=='WHATSAPP' && outMessage?.type=='template'
      && outMessage.template?.components) 
    outMessage.template.components = outMessage.template.components.map(x=>{
      x.parameters = x.parameters.map(y=>{
	y.text = nunjucksEnv.renderString(y.text, speakerData);
	return y;
      });
      return x;
    });

  return {
    nextCode: nextCode,
    outChannel: outChannel,
    outMessage: outMessage,
    closeConversation: closeConversation,
    delayedAction: delayedAction,
  };
};

module.exports={
  determineAction: determineAction
};
