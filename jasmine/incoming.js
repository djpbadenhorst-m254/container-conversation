const clients = require('../src/clients');
const incoming = require('../src/incoming');
const action = require('../src/action');

const test_01 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'qwe'});
    let conv = await incoming.selectConversation(speaker.id, 'asd', 'SMS');
    expect(conv).toBe(undefined);
    
    conv = await incoming.selectConversation(speaker.id, ' Hi ', 'SMS');
    expect(conv.latest_outgoing_code).toBe('INIT');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','qwe');
        
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    let result = await db('speakers').where('id',speaker[0].id);
    expect(result.length).toBe(0);
  }
};
const test_02 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'qwe'});
    let conv = await incoming.selectConversation(speaker.id, 'asd', 'WHATSAPP');
    expect(conv.latest_outgoing_code).toBe('INIT');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','qwe');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result = await db('speakers').where('id',speaker[0].id);
    expect(result.length).toBe(0);
  }
};
const test_03 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'qwe'});
    let conv = await incoming.selectConversation(speaker.id, 'hi', 'SMS');
    await clients.updateConversation(conv.id, {status:'closed'});

    conv = await incoming.selectConversation(speaker.id, 'hi', 'SMS');
    expect(conv.latest_outgoing_code).toBe('INIT_RETURN');
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
    expect(conv.latest_outgoing_code).toBe('INIT_RETURN');
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
const test_05 = async () => {
  try {
    let result = await incoming.processIncoming({
      channel: 'SMS',
      phoneNumber: '123',
      message: '',
    });
    expect(result).toBe(undefined);
    result = await incoming.processIncoming({
      channel: 'SMS',
      phoneNumber: '123',
      message: ' Hi ',
    });
    expect(result.data.nextCode).toBe('SMS/INTRO1_PRE');
    
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    let conversation = await db('conversations').where('speaker_id',speaker[0].id);
    let log = await db('incoming').where('conversation_id',conversation[0].id);
    expect(log.length).toBe(1);
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result = await db('speakers').where('id',speaker[0].id);
    expect(result.length).toBe(0);
  }
};
const test_06 = async () => {
  try {
    spyOn(action, 'determineAction').and.returnValue(
      Promise.resolve({
	nextCode: 'CLOSED',
      })
    );
    
    let result = await incoming.processIncoming({
      channel: 'SMS',
      phoneNumber: '123',
      message: 'Hi',
    });
    expect(result).toBe(undefined);
    
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    let conversation = await db('conversations').where('speaker_id',speaker[0].id);
    expect(conversation[0].status).toBe('closed');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result = await db('speakers').where('id',speaker[0].id);
    expect(result.length).toBe(0);
  }
};
const test_07 = async () => {
  try {
    spyOn(action, 'determineAction').and.returnValue(
      Promise.resolve({
	nextCode: 'OTHER',
      })
    );
    
    let result = await incoming.processIncoming({
      channel: 'SMS',
      phoneNumber: '123',
      message: 'Hi',
    });
    expect(result).toBe(undefined);
    
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    let conversation = await db('conversations').where('speaker_id',speaker[0].id);
    expect(conversation[0].latest_outgoing_code).toBe('OTHER');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    let conv = await incoming.selectConversation(speaker[0].id, 'RESET', 'DOESNT_MATTER');
    
    let result = await db('speakers').where('id',speaker[0].id);
    expect(result.length).toBe(0);
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
  it('test_05: Test processIncoming - Basic Usage', test_05);
  it('test_06: Test processIncoming - Closed Conversation', test_06);
  it('test_07: Test processIncoming - No Action Required', test_07);
});
