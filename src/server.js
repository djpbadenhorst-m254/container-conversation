const incoming = require('./incoming.js');
const outgoing = require('./outgoing.js');

const express = require('express');
const app = express();
app.use(express.json());

app.post('/conversations/incoming/sms', (req, res) => {
  let data = {
    phoneNumber: req.body.from,
    message: req.body.text,
  };
  return incoming.process(data)
    .then(msg => res.end(JSON.stringify({message:'Succeeded'})))
    .catch(err => res.end(JSON.stringify({message:'Failed', error: err})));
});

app.post('/conversations/outgoing/sms', (req, res) => {
  console.log(req.body);
  let data = {
    from: req.body.source,
    to: req.body.destination, 
    message: req.body.message,
  };
  console.log(data);
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
app.post('/conversations/cron', (req, res) => {
  return incoming(req.body)
    .then(msg => res.end(JSON.stringify({message:'Succeeded'})))
    .catch(err => res.end(JSON.stringify({message:'Failed', error: err})));
})
*/
