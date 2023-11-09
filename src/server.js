const m254Utils = require('m254-utils');
const logger = m254Utils.logger;
const CODES = m254Utils.CONSTANTS.CODES;

const incoming = require('./incoming.js');
const outgoing = require('./outgoing.js');

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//SMS webhook
app.post('/conversations/incoming/sms', (req, res) => {
  logger.info('SMS received', {tags:[
    CODES.MON.CNV.INC_RECEIVE_SMS
  ], data:req.body});
  
  let data = {
    channel: 'SMS',
    message: req.body.text,
    phoneNumber: req.body.from,
  };
  
  incoming.process(data)
    .then(msg => {
      logger.info('SMS processed', {tags:[
	CODES.MON.CNV.OUT_RECEIVE_SMS
      ], data:req.body});
      return res.sendStatus(200);
    })
    .catch(err => {
      logger.error('Could not process SMS', {tags:[
	CODES.ERR.CNV.OUT_RECEIVE_SMS
      ], data:err});
      return res.sendStatus(200);
    });
});

// Verification of Whatsapp webhook
app.get('/conversations/incoming/whatsapp', async (req, res) => {
  if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == 'TOKEN') {
    return res.send(req.query['hub.challenge']);
  } else {
    return res.sendStatus(400);
  }
});

//Whatsapp webhook
app.post('/conversations/incoming/whatsapp', async (req, res) => {
  logger.info('Whatsapp received', {tags:[
    CODES.MON.CNV.REQ.INC_RECEIVE_WHATSAPP
  ], data:req.body});
  
  let messages = req.body.entry.map(entry => 
    entry?.changes ? entry.changes.map(change => 
      change.field=='messages' ? change.value?.messages : []
    ) : []
  ).reduce((x,y)=>x.concat([...y]),[]);

  Promise.all(messages.forEach(async message => {
    try {
      logger.debug('Whatsapp payload', {tags:[
	CODES.CHK.CNV.REQ.MID_RECEIVE_WHATSAPP
      ], data:message});

      //TODO
      outgoing.tickWhatsapp({phoneNumberId: 'a', messageId: 'a'});
      
      let data = {
	channel: 'WHATSAPP',
	phoneNumber: '+' + message.from,
      };
      
      if (message.type=='text')
	data.message = message.text?.body;
      else if (message.type=='interactive' && message.interactive?.type=='list_reply')
	data.message = message.interactive?.list_reply?.id;
      else if (message.type=='interactive' && message.interactive?.type=='button_reply')
	data.message = message.interactive?.button_reply?.id;
      
      await incoming.process(data);
      logger.info('Whatsapp processed', {tags:[
	CODES.MON.CNV.REQ.OUT_RECEIVE_WHATSAPP
      ], data:req.body});
    } catch (err) {
      logger.error('Could not process Whatsapp', {tags:[
	CODES.ERR.CNV.REQ.OUT_RECEIVE_WHATSAPP
      ], data:err});
    }
  })).then(x=>res.sendStatus(200));
});

// Send SMS
app.post('/conversations/outgoing/sms', (req, res) => {
  logger.info('Sending SMS', {tags:[
    CODES.MON.CNV.REQ.INC_SEND_SMS
  ], data:req.body});
  let data = {
    from: req.body.source,
    to: req.body.destination, 
    message: req.body.message,
  };
  return outgoing.sendSms(data)
    .then(msg => {
      logger.info('Sent SMS', {tags:[
	CODES.MON.CNV.REQ.OUT_SEND_SMS
      ]});
      res.end(JSON.stringify({message:'Succeeded'}));
    })
    .catch(err => {
      logger.error('Failure sending SMS', {tags:[
	CODES.ERR.CNV.REQ.INC_SEND_SMS
      ], data:err});
      res.end(JSON.stringify({message:'Failed', error: err}));
    });
});

//Run server
app.listen(8888, () => {
  console.log('Server listening');
});
