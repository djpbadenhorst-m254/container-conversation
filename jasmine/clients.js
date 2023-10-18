const clients = require('../src/clients');

const test_01 = async () => {
  let speaker1 = await clients.getSpeaker({phoneNumber:'123'});
  let speaker2 = await clients.getSpeaker({phoneNumber:'123'});

  expect(speaker1.id).toEqual(speaker2.id);

  let db = clients.getKnex();
  await db('speakers').where('phone_number','123').del();
};

const test_02 = async () => {
  let speaker = await clients.getSpeaker({phoneNumber:'321'});
  
  let conversation1 = await clients.getSpeakerConversations(speaker.id);
  let conversation2 = await clients.getSpeakerConversations(speaker.id);

  let db = clients.getKnex();
  await db('conversations').insert([{status:'active', speaker_id:speaker.id}]);
  let conversations = await clients.getSpeakerConversations(speaker.id);

  expect(conversation1[0].id).toEqual(conversation2[0].id);
  expect(conversations.length).toEqual(2);

  await db('conversations').where('id',conversations[0].id).del();
  await db('conversations').where('id',conversations[1].id).del();
  await db('speakers').where('phone_number','321').del();
};

const test_03 = async () => {
  let speaker = await clients.getSpeaker({phoneNumber:'abc'});
  
  let prvConversation = await clients.getSpeakerConversations(speaker.id);
  await clients.updateConversation(prvConversation[0].id, {status:'dormant'});
  
  let curConversation = await clients.getConversation(prvConversation[0].id);
  expect(curConversation[0].status).toEqual('dormant');

  let db = clients.getKnex();
  await db('conversations').where('id',curConversation[0].id).del();
  await db('speakers').where('phone_number','abc').del();
};

const test_04 = async () => {
  let speaker = await clients.getSpeaker({phoneNumber:'def'});

  let speakerData;
  speakerData = await clients.getSpeakerData(speaker.id);
  expect(speakerData).toEqual(undefined);

  await clients.updateSpeakerData(speaker.id, {name:'dirk'});
  speakerData = await clients.getSpeakerData(speaker.id,{});
  expect(speakerData).toEqual({name:'dirk'});

  await clients.updateSpeakerData(speaker.id, {name:'other', age:34});
  speakerData = await clients.getSpeakerData(speaker.id,{});
  expect(speakerData).toEqual({age:34, name:'other'});
  
  let db = clients.getKnex();
  await db('speaker_data').where('speaker_id',speaker.id).del();
  await db('speakers').where('phone_number','def').del();
};

describe('clients', function() {  
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
    process.env['DATAWAREHOUSE_USERNAME'] = 'root';
    process.env['DATAWAREHOUSE_PASSWORD'] = 'password';
    process.env['DATAWAREHOUSE_DATABASE'] = 'conversation';
    clients.setKnex();
  });

  it('clients: Test getSpeaker', test_01);
  it('clients: Test getSpeakerConversations', test_02);
  it('clients: Test updateConversation', test_03);
  it('clients: Test updateSpeakerData', test_04);
});
