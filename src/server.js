const _ = require('lodash');

const m254Utils = require('m254-utils');
const logger = m254Utils.logger;
const CODES = m254Utils.CONSTANTS.CODES;

const clients = require('../src/clients');
const incoming = require('./incoming.js');
const outgoing = require('./outgoing.js');
const delayed = require('./delayed.js');

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//SMS webhook
app.post('/conversations/incoming/sms', (req, res) => {
  logger.info('SMS received', {tags:[
    CODES.MON.CNV.REQ.RECEIVE_SMS.INCOMING
  ], data:req.body});
  
  let data = {
    channel: 'SMS',
    message: req.body.text,
    phoneNumber: req.body.from,
  };
  
  return incoming.processIncoming(data)
    .then(async data => {
      if (data) {
	await outgoing.processOutgoing(data);
	await delayed.processDelayed(data);
      }
    }).then(() => 
      logger.info('SMS processed', {tags:[
	CODES.MON.CNV.REQ.RECEIVE_SMS.OUTGOING
      ]})
    ).then(() => {
      return res.sendStatus(200);
    }).catch(err => {
      logger.error('Could not process SMS', {tags:[
	CODES.ERR.CNV.REQ.RECEIVE_SMS.OUTGOING
      ], data: {error:err.toString()}});
      return res.sendStatus(200);
    });
});

app.post('/conversations/incoming/sms/delivery', async (req, res) => {
  try {
    logger.info('SMS Status Change Received', {tags:[
      CODES.MON.CNV.REQ.RECEIVE_SMS.STATUS_CHANGE
    ], data:req.body });
    await clients.updateOutgoing(req.body.id, {status:'delivered'});
    return res.sendStatus(200);
  } catch (err) {
    logger.error('Could not resolve SMS Status Change', {tags:[
      CODES.ERR.CNV.REQ.RECEIVE_WHATSAPP.STATUS_CHANGE
    ], data: {error:err.toString()}});
    return res.sendStatus(200);
  }
});

// Verification of Whatsapp webhook
app.get('/conversations/incoming/whatsapp', (req, res) => {
  if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == 'TOKEN') {
    return res.send(req.query['hub.challenge']);
  } else {
    return res.sendStatus(400);
  }
});

//Whatsapp webhook
app.post('/conversations/incoming/whatsapp', (req, res) => {
  logger.info('Whatsapp data received', {tags:[
    CODES.MON.CNV.REQ.RECEIVE_WHATSAPP.INCOMING
  ], data:req.body});

  // Extract messages
  let messages = req.body.entry.map(entry => 
    entry?.changes ? entry.changes.map(change => 
      (change.field=='messages' && change.value?.messages) ?
	change.value?.messages.map(
	  message=>({...message, whatsapp_user_id: change.value?.metadata?.phone_number_id})
      ) : []
    ) : []
  );
  messages = messages.reduce((x,y)=>x.concat([...y]),[]) || [];
  messages = messages.reduce((x,y)=>x.concat([...y]),[]) || [];
  
  // Extract statusChanges
  let statusChanges = req.body.entry.map(entry => 
    entry?.changes ? entry.changes.map(change => 
      (change.field=='messages' && change.value?.statuses) ?
	change.value?.statuses.map(
	  status=>({...status, whatsapp_user_id: change.value?.metadata?.phone_number_id})
      ) : []
    ) : []
  );
  statusChanges = statusChanges.reduce((x,y)=>x.concat([...y]),[]) || [];
  statusChanges = statusChanges.reduce((x,y)=>x.concat([...y]),[]) || [];

  return Promise.all(
    messages.map(async message => {
      try {
	outgoing.tickWhatsapp({phoneNumberId: message.whatsapp_user_id, messageId: message.id});
	logger.debug('Whatsapp payload', {tags:[
	  CODES.CHK.CNV.REQ.RECEIVE_WHATSAPP.WHATSAPP_PAYLOAD
	], data:message});
	
	let data = {
	  channel: 'WHATSAPP',
	  phoneNumber: '+' + message.from,
	  channelId: message.id,
	};
	
	if (message.type=='text')
	  data.message = message.text?.body;
	else if (message.type=='interactive' && message.interactive?.type=='list_reply')
	  data.message = message.interactive?.list_reply?.id;
	else if (message.type=='interactive' && message.interactive?.type=='button_reply')
	  data.message = message.interactive?.button_reply?.id;
	else if (message.type=='button')
	  data.message = message.button?.text;
	
	await incoming.processIncoming(data)
	  .then(async data => {
	    if (data) {
	      await outgoing.processOutgoing(data);
	      await delayed.processDelayed(data);
	    }
	  }).then(() => 
	    logger.info('Whatsapp processed', {tags:[
	      CODES.MON.CNV.REQ.RECEIVE_WHATSAPP.OUTGOING
	    ],})
	  );
      } catch (err) {
	logger.error('Could not process Whatsapp', {tags:[
	  CODES.ERR.CNV.REQ.RECEIVE_WHATSAPP.OUTGOING
	], data: {error:err.toString()}});
      }
    }).concat(
      statusChanges.map(async x=> {
	try {
	  await clients.updateOutgoing(x.id, {status:x.status});
	  logger.info('Whatsapp Status Change processed', {tags:[
	    CODES.MON.CNV.REQ.RECEIVE_WHATSAPP.STATUS_CHANGE
	  ], data:{id: x.id, status: x.status}});
	} catch (err) {
	  logger.error('Could not resolve Whatsapp Status Change', {tags:[
	    CODES.ERR.CNV.REQ.RECEIVE_WHATSAPP.STATUS_CHANGE
	  ], data: {error:err.toString()}});
	}
      })
    )
  ).then(x=>res.sendStatus(200));
});

// Send SMS
app.post('/conversations/outgoing/sms', (req, res) => {
  logger.info('Sending SMS', {tags:[
    CODES.MON.CNV.REQ.SEND_SMS.INCOMING
  ], data:req.body});
  
  let data = {
    from: req.body.source,
    to: req.body.destination, 
    message: req.body.message,
  };
  
  return outgoing.sendSms(data)
    .then(msg => {
      logger.info('Sent SMS', {tags:[
	CODES.MON.CNV.REQ.SEND_SMS.OUTGOING
      ]});
      res.status(200).json({message:'Succeeded'});
    }).catch(err => {
      logger.error('Failure sending SMS', {tags:[
	CODES.ERR.CNV.REQ.SEND_SMS.OUTGOING
      ], data: {error:err.toString()}});
      res.status(500).json({message:'Failed', error: err.toString()});
    });
});

// Finqual Entrypoint
app.post('/conversations/finqual', async (req, res) => {
  logger.info('Finqual request received', {tags:[
    CODES.MON.CNV.REQ.FINQUAL.INCOMING
  ], data:req.body});

  // Check input
  if (!(req.body.phone_number))
    return res.status(500).send(JSON.stringify({
      status: 'failure',
      payload: {error: 'No phone_number specified'}
    }));
  if (!(req.body.phone_number.startsWith('+')))
    return res.status(500).send(JSON.stringify({
      status: 'failure',
      payload: {error: 'Invalid phone number specified'}
    }));

  // Obtain speaker
  let speaker = await clients.getSpeaker({phoneNumber: req.body.phone_number});
  await clients.updateSpeakerData(speaker.id,_.omit(req.body,['phone_number']));

  // Clear conversations and create new one
  let conversations = await clients.getConversationsBySpeakerId(speaker.id);
  conversations = conversations.filter(x=>x.status=='active');
  await Promise.all(conversations.map(conv =>
    clients.updateConversation(conv.id, {status:'closed'})
  ));

  await clients.createConversation(speaker.id).then(conv=>{
    let data = {
      latest_outgoing_code:'WAP/FINQUAL/INIT_WITH_API',
      latest_outgoing_ts: new Date()
    };
    return clients.updateConversation(conv.id, data);
  });
  
  // Simulate incoming message
  let data = {
    channel: 'WHATSAPP',
    message: 'simulated',
    phoneNumber: req.body.phone_number,
    channelId: 'simulated',
  };

  return incoming.processIncoming(data)
    .then(async data => {
      if (data) {
	await outgoing.processOutgoing(data);
	await delayed.processDelayed(data);
      }
    }).then(() => {
      logger.info('Finqual request processed', {tags:[
	CODES.MON.CNV.REQ.FINQUAL.OUTGOING
      ]});
      return res.status(200).send(JSON.stringify({ status: 'success' }));
    }).catch(err => {
      logger.error('Could not process Finqual request', {tags:[
	CODES.ERR.CNV.REQ.FINQUAL.OUTGOING
      ], data: {error:err.toString()}});
      return res.status(500).send(JSON.stringify({ status: 'failure' }));
    });;
});

//Run server
app.listen(8888, () => {
  console.log('Server listening');
});
