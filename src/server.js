const incoming = require('./incoming.js');
const outgoing = require('./outgoing.js');

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/conversations/incoming/sms', (req, res) => {
  let data = {
    channel: 'SMS',
    message: req.body.text,
    phoneNumber: req.body.from,
  };
  incoming.process(data)
    .then(msg => res.sendStatus(200))
    .catch(err => {
      console.log(err);
      return res.sendStatus(200);
    });
});

app.get('/conversations/incoming/whatsapp', async (req, res) => {
  if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == 'TOKEN') {
    return res.send(req.query['hub.challenge']);
  } else {
    return res.sendStatus(400);
  }
});

app.post('/conversations/incoming/whatsapp', async (req, res) => {
  let body = req.body;
  
  await Promise.all(body.entry.map(entry=> {
    if (entry?.changes) {
      return Promise.all(entry?.changes.map(async change=>{
	if (change.field == 'messages') {
	  let payload = change.value;
	  await (payload?.messages || []).forEach(
	    async message => {
	      try {
		//console.log(JSON.stringify(message,null,2));
		let timestamp = message.timestamp;
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
	      } catch (error) {}
	    }
	  );
	}
      }));
    }
    else
      return res.sendStatus(200);
  }));
  return res.sendStatus(200);
});

app.post('/conversations/outgoing/sms', (req, res) => {
  let data = {
    from: req.body.source,
    to: req.body.destination, 
    message: req.body.message,
  };
  return outgoing.sendSms(data)
    .then(msg => res.end(JSON.stringify({message:'Succeeded'})))
    .catch(err => res.end(JSON.stringify({message:'Failed', error: err})));
});

app.listen(8888, () => {
  console.log('Server listening');
});
