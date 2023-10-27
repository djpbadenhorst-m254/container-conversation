const clients = require('../src/clients');
const { determineAction } = require('../src/action');

let action;
const test_01 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'INIT',
    incMessage: 'Hi ',
  });
  expect(action.nextCode).toEqual('POC1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'INIT',
    incMessage: 'abc',
  });
  expect(action.nextCode).toEqual('?');
};
const test_02 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'POC1',
    incMessage: 'Hi',
  });
  expect(action.nextCode).toEqual('POC1_RETRY');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'POC1',
    incMessage: '5',
  });
  expect(action.nextCode).toEqual('POC1_RETRY');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'POC1',
    incMessage: '1',
  });
  expect(action.nextCode).toEqual('POC2');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'POC1',
    incMessage: '2',
  });
  expect(action.nextCode).toEqual('?');
};
const test_03 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC2',
      incMessage: ' Dirk Badenhorst',
    });
    expect(action.nextCode).toEqual('POC3');

    let speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.first_name).toEqual('Dirk');
    expect(speakerData.last_name).toEqual('Badenhorst');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_04 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC3',
      incMessage: 'something',
    });
    expect(action.nextCode).toEqual('POC3_RETRY2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC3',
      incMessage: '10',
    });
    expect(action.nextCode).toEqual('POC3_RETRY1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC3',
      incMessage: '100000',
    });
    expect(action.nextCode).toEqual('POC4');

    let speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.initial_loan_amount).toEqual(100000);
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_05 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC4',
      incMessage: 'something',
    });
    expect(action.nextCode).toEqual('POC4_RETRY');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC4',
      incMessage: '0',
    });
    expect(action.nextCode).toEqual('POC4_RETRY');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC4',
      incMessage: '3',
    });
    expect(action.nextCode).toEqual('POC5');

    let speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('PSV or Uber');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_06 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC5',
      incMessage: 'something',
    });
    expect(action.nextCode).toEqual('POC5_RETRY');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC5',
      incMessage: '0',
    });
    expect(action.nextCode).toEqual('POC5_RETRY');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC5',
      incMessage: '1990',
    });
    expect(action.nextCode).toEqual('POC6');

    let speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_year).toEqual(1990);
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_07 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    await clients.updateSpeakerData(speaker.id, {
      first_name: 'John',
      last_name: 'Smith',
      initial_loan_amount:100000
    });
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC6',
      incMessage: 'something',
    });
    expect(action.nextCode).toEqual('POC6_RETRY2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC6',
      incMessage: '99999',
    });
    expect(action.nextCode).toEqual('POC6_RETRY1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'POC6',
      incMessage: '150000',
    });
    expect(action.nextCode).toEqual('POC7');

    let speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.estimated_owned_vehicle_value).toEqual(150000);
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};

describe('action', function() {
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
    process.env['DATAWAREHOUSE_USERNAME'] = 'root';
    process.env['DATAWAREHOUSE_PASSWORD'] = 'password';
    process.env['DATAWAREHOUSE_DATABASE'] = 'conversation';
    process.env['DIRECTUS_URL'] = 'http://0.0.0.0:8055';
    process.env['DIRECTUS_ADMIN_TOKEN'] = 'token';
    clients.setKnex();
  });

  //it('test_01: Test INIT', test_01);
  //it('test_02: Test POC1', test_02);
  //it('test_03: Test POC2', test_03);
  //it('test_04: Test POC3', test_04);
  //it('test_05: Test POC4', test_05);
  //it('test_06: Test POC5', test_06);
  it('test_07: Test POC6', test_07);
});
