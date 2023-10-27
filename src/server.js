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

/*
app.post('/conversations/incoming', (req, res) => {
  return incoming(req.body)
    .then(msg => res.end(JSON.stringify({message:'Succeeded'})))
    .catch(err => res.end(JSON.stringify({message:'Failed', error: err})));
})
*/
