const clients = require('../src/clients');

const test_01 = async () => {
  try {
    let speaker1 = await clients.getSpeaker({phoneNumber:'123'});
    let speaker2 = await clients.getSpeaker({phoneNumber:'123'});
    expect(speaker1.id).toEqual(speaker2.id);
    
    let speakerData = await clients.getSpeakerData(speaker1.id);
    expect(speakerData.phone_number).toEqual('123');
    
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id', speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_02 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'321'});
    
    let conversation1 = await clients.getConversationsBySpeakerId(speaker.id);
    expect(conversation1.length).toEqual(0);
    
    await clients.createConversation(speaker.id);
    let conversation2 = await clients.getConversationsBySpeakerId(speaker.id);
    expect(conversation2.length).toEqual(1);
    
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','321');
    await db('conversations').where('speaker_id',speaker[0].id).del();
    await db('speaker_data').where('speaker_id', speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_03 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'abc'});
    await clients.createConversation(speaker.id);
    let initConv = await clients.getConversationsBySpeakerId(speaker.id);
    expect(initConv[0].status).toEqual('active');
    
    await clients.updateConversation(initConv[0].id, {status:'dormant'});
    let updConv = await clients.getConversationsBySpeakerId(speaker.id);
    expect(updConv[0].status).toEqual('dormant');
    
    let allConv = await clients.getConversationsBySpeakerId(speaker.id);
    expect(allConv.length).toEqual(1);
    
    let filtConv = await clients.getConversationsBySpeakerId(speaker.id, ['active']);
    expect(filtConv.length).toEqual(0);

  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','abc');
    await db('conversations').where('speaker_id',speaker[0].id).del();
    await db('speaker_data').where('speaker_id', speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_04 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'abc'});
    
    let speakerData;
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData).toEqual({phone_number: 'abc'});

    await clients.updateSpeakerData(speaker.id, {name:'dirk'});
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData).toEqual({phone_number: 'abc', name:'dirk'});
    
    await clients.updateSpeakerData(speaker.id, {name:'other', age:34});
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData).toEqual({phone_number: 'abc', age:34, name:'other'});
    
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','abc');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_05 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'def'});
    await clients.createConversation(speaker.id);
    let conv = await clients.getConversationsBySpeakerId(speaker.id);
    
    await clients.logResponse({
      timestamp: new Date(),
      speakerId: speaker.id,
      conversationId: conv[0].id,
      conversion_code: conv[0].last_interaction_code,
      channel: 'SMS',
      payload: {message: 'some_message'},
    });
    
    let db = clients.getKnex();
    let log = await db('responses').where('speaker_id',speaker.id);
    expect(log.length).toEqual(1);
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','def');
    await db('responses').where('speaker_id',speaker[0].id).del();
    await db('conversations').where('speaker_id',speaker[0].id).del();
    await db('speaker_data').where('speaker_id', speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};

describe('clients', function() {
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
    process.env['DATAWAREHOUSE_USERNAME'] = 'root';
    process.env['DATAWAREHOUSE_PASSWORD'] = 'password';
    process.env['DATAWAREHOUSE_DATABASE'] = 'conversation';
    clients.setKnex();
  });

  it('test_01: Test getSpeaker', test_01);
  it('test_02: Test getSpeakerConversations', test_02);
  it('test_03: Test updateConversation', test_03);
  it('test_04: Test updateSpeakerData', test_04);
  it('test_05: Test logResponse', test_05);
});
