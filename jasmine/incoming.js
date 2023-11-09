const clients = require('../src/clients');
const incoming = require('../src/incoming');

const test_01 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'qwe'});
    let conv = await incoming.selectConversation(speaker.id, 'asd', 'SMS');
    expect(conv).toBe(undefined);

    conv = await incoming.selectConversation(speaker.id, ' Hi ', 'SMS');
    expect(conv.last_interaction_code).toBe('INIT');
    
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','qwe');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result1 = await db('speaker_data').where('speaker_id', speaker[0].id);
    expect(result1.length).toBe(0);
    let result2 = await db('speakers').where('id',speaker[0].id);
    expect(result1.length).toBe(0);
  }
};
const test_02 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'qwe'});
    let conv = await incoming.selectConversation(speaker.id, 'asd', 'WHATSAPP');
    expect(conv.last_interaction_code).toBe('INIT');
    
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','qwe');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result1 = await db('speaker_data').where('speaker_id', speaker[0].id);
    expect(result1.length).toBe(0);
    let result2 = await db('speakers').where('id',speaker[0].id);
    expect(result1.length).toBe(0);
  }
};
const test_03 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'qwe'});
    let conv = await incoming.selectConversation(speaker.id, 'hi', 'SMS');
    await clients.updateConversation(conv.id, {status:'closed'});

    conv = await incoming.selectConversation(speaker.id, 'hi', 'SMS');
    expect(conv.last_interaction_code).toBe('INIT_RETURN');
    
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','qwe');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result1 = await db('speaker_data').where('speaker_id', speaker[0].id);
    expect(result1.length).toBe(0);
    let result2 = await db('speakers').where('id',speaker[0].id);
    expect(result1.length).toBe(0);
  }
};
const test_04 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'qwe'});
    let conv = await incoming.selectConversation(speaker.id, 'asd', 'WHATSAPP');
    await clients.updateConversation(conv.id, {status:'closed'});

    conv = await incoming.selectConversation(speaker.id, 'asd', 'WHATSAPP');
    expect(conv.last_interaction_code).toBe('INIT_RETURN');
    
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','qwe');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result1 = await db('speaker_data').where('speaker_id', speaker[0].id);
    expect(result1.length).toBe(0);
    let result2 = await db('speakers').where('id',speaker[0].id);
    expect(result1.length).toBe(0);
  }
};

describe('incoming', function() {  
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
    process.env['DATAWAREHOUSE_USERNAME'] = 'root';
    process.env['DATAWAREHOUSE_PASSWORD'] = 'password';
    process.env['DATAWAREHOUSE_DATABASE'] = 'conversation';
    clients.setKnex();
  });

  it('test_01: Test first conversation on SMS', test_01);
  it('test_02: Test first conversation on WHATSAPP', test_02);
  it('test_03: Test return conversation on SMS', test_03);
  it('test_04: Test return conversation on WHATSAPP', test_04);
});

