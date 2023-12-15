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
    
    await clients.updateConversation(initConv[0].id, {
      status:'dormant',
      latest_outgoing_ts: new Date(), 
      latest_outgoing_code: 'SOME_CODE',
    });
    let updConv = await clients.getConversationsBySpeakerId(speaker.id);
    expect(updConv[0].status).toEqual('dormant');
    expect(updConv[0].latest_outgoing_code).toEqual('SOME_CODE');
    
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
    let speaker = await clients.getSpeaker({phoneNumber:'321'});
    await clients.createConversation(speaker.id);
    let conversation1 = await clients.getConversationsBySpeakerId(speaker.id);

    await clients.logOutgoing({
      timestamp: new Date(),
      conversationId: conversation1[0].id,
      channel: 'SMS',
      channelId: '123',
      status: 'sent',
      payload: {message: 'some_message'},
      conversationCode: 'X1',
    });
    
    await clients.logOutgoing({
      timestamp: new Date(),
      conversationId: conversation1[0].id,
      channel: 'SMS',
      channelId: '123',
      status: 'sent',
      payload: {message: 'some_message'},
      conversationCode: 'X2',
    });

    let db = clients.getKnex();
    let outgoing = await db('outgoing').where('conversation_id',conversation1[0].id);
    expect(outgoing.length).toEqual(2);
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','321');
    let conversation = await db('conversations').where('speaker_id',speaker[0].id);
    await db('incoming').where('conversation_id',conversation[0].id).del();
    await db('outgoing').where('conversation_id',conversation[0].id).del();
    await db('conversations').where('speaker_id',speaker[0].id).del();
    await db('speaker_data').where('speaker_id', speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_05 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'321'});
    await clients.createConversation(speaker.id);
    let conversation1 = await clients.getConversationsBySpeakerId(speaker.id);

    await clients.logIncoming({
      timestamp: new Date(),
      conversationId: conversation1[0].id,
      channel: 'SMS',
      channelId: '123',
      status: 'sent',
      payload: {message: 'some_message'},
      conversationCode: 'X1',
    });

    await clients.logIncoming({
      timestamp: new Date(),
      conversationId: conversation1[0].id,
      channel: 'SMS',
      channelId: '123',
      status: 'sent',
      payload: {message: 'some_message'},
      conversationCode: 'X2',
    });

    let db = clients.getKnex();
    let incoming = await db('incoming').where('conversation_id',conversation1[0].id);
    expect(incoming.length).toEqual(2);
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','321');
    let conversation = await db('conversations').where('speaker_id',speaker[0].id);
    await db('incoming').where('conversation_id',conversation[0].id).del();
    await db('outgoing').where('conversation_id',conversation[0].id).del();
    await db('conversations').where('speaker_id',speaker[0].id).del();
    await db('speaker_data').where('speaker_id', speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_06 = async () => {
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
const test_07 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'321'});
    await clients.createConversation(speaker.id);
    let conversation1 = await clients.getConversationsBySpeakerId(speaker.id);

    await clients.logOutgoing({
      timestamp: new Date(),
      conversationId: conversation1[0].id,
      channel: 'SMS',
      channelId: '123',
      status: 'sent',
      payload: {message: 'some_message'},
      conversationCode: 'X1',
    });
    await clients.updateOutgoing('123',{status:'read'});
    
    let db = clients.getKnex();
    let outgoing = await db('outgoing').where('conversation_id',conversation1[0].id);
    expect(outgoing[0].status).toEqual('read');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','321');
    let conversation = await db('conversations').where('speaker_id',speaker[0].id);
    await db('incoming').where('conversation_id',conversation[0].id).del();
    await db('outgoing').where('conversation_id',conversation[0].id).del();
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
  it('test_02: Test getConversationsBySpeakerId', test_02);
  it('test_03: Test updateConversation', test_03);
  it('test_04: Test outgoing', test_04);
  it('test_05: Test incoming', test_05);
  it('test_06: Test updateSpeakerData', test_06);
  it('test_07: Test updateOutgoing', test_07);
});
