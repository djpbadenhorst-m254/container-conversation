const clients = require('../../src/clients');
const { determineAction } = require('../../src/action');

let action;
const test_01 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'INIT',
    incMessage: 'Hi ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_PRE');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'INIT',
    incMessage: 'abc',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('CLOSED');
};
const test_02 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_PRE',
    incMessage: 'Hi',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1');
};
const test_03 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: 'Hi',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '5',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '1',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO2');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '2',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/UWC_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '3 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/PL_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '4 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/OL_REDIRECT');
};
const test_04 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_E1',
    incMessage: 'Hi',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_E1',
    incMessage: '5',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_E1',
    incMessage: '1',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO2');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_E1',
    incMessage: '2',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/UWC_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_E1',
    incMessage: '3 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/PL_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_E1',
    incMessage: '4 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/OL_REDIRECT');
};
const test_05 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/INTRO2',
      incMessage: ' John Stewart Smith ',
      incChannel: 'SMS',
    });
    expect(action.nextCode).toEqual('SMS/LBL1');

    let speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.first_name).toEqual('John');
    expect(speakerData.last_name).toEqual('Stewart Smith');
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
      prevCode: 'SMS/LBL1',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL1_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1',
      incMessage: '10',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL1_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1',
      incMessage: '100000',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2');

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
const test_07 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E1',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL1_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E1',
      incMessage: '10',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL1_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E1',
      incMessage: '100000',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E1',
      incMessage: '0',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/INTRO1_RESTART');

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
const test_08 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E2',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL1_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E2',
      incMessage: '10',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL1_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E2',
      incMessage: '100000',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL1_E2',
      incMessage: '0',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/INTRO1_RESTART');

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
const test_09 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    let speakerData;
    await clients.updateSpeakerData(speaker.id, {
      initial_loan_amount:100000
    });
    
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2',
      incMessage: '1',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Private Vehicle');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2',
      incMessage: '2',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Commercial Truck');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2',
      incMessage: '3',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('PSV or Uber');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2',
      incMessage: '4',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2_DNQ2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2',
      incMessage: '5',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2_DNQ1');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_10 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    let speakerData;
    await clients.updateSpeakerData(speaker.id, {
      initial_loan_amount:100000
    });
    
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2_E1',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2_E1',
      incMessage: '1',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Private Vehicle');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2_E1',
      incMessage: '2',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Commercial Truck');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2_E1',
      incMessage: '3',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('PSV or Uber');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2_E1',
      incMessage: '4',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2_DNQ2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2_E1',
      incMessage: '5',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL2_DNQ1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL2_E1',
      incMessage: '0',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/INTRO1_RESTART');
  } catch (error) {
    console.log(error);
  } finally {
    let db = clients.getKnex();
    let speaker = await db('speakers').where('phone_number','123');
    await db('speaker_data').where('speaker_id',speaker[0].id).del();
    await db('speakers').where('id',speaker[0].id).del();
  }
};
const test_11 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL3',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL3',
      incMessage: '100',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL3',
      incMessage: '1990',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4');

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
const test_12 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL3_E1',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL3_E1',
      incMessage: '100',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL3_E1',
      incMessage: '0',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/INTRO1_RESTART');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL3_E1',
      incMessage: '1990',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4');

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
const test_13 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    await clients.updateSpeakerData(speaker.id, {
      first_name: 'John',
      last_name: 'Smith',
      initial_loan_amount:100000
    });
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4',
      incMessage: '99999',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4',
      incMessage: '150000',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL_RESULTS_PASS');

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
const test_14 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    await clients.updateSpeakerData(speaker.id, {
      first_name: 'John',
      last_name: 'Smith',
      initial_loan_amount:100000
    });
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E1',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E1',
      incMessage: '99999',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E1',
      incMessage: '0',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/INTRO1_RESTART');
    
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E1',
      incMessage: '150000',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL_RESULTS_PASS');

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
const test_15 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    await clients.updateSpeakerData(speaker.id, {
      first_name: 'John',
      last_name: 'Smith',
      initial_loan_amount:100000
    });
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E2',
      incMessage: 'something',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E2',
      incMessage: '99999',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL4_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E2',
      incMessage: '0',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/INTRO1_RESTART');
    
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'SMS/LBL4_E2',
      incMessage: '150000',
      incChannel: 'SMS'
    });
    expect(action.nextCode).toEqual('SMS/LBL_RESULTS_PASS');

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
const test_16 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_RESTART',
    incMessage: 'Hi',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_RESTART',
    incMessage: '5',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_RESTART',
    incMessage: '1',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO2');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_RESTART',
    incMessage: '2',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/UWC_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_RESTART',
    incMessage: '3 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/PL_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1_RESTART',
    incMessage: '4 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/OL_REDIRECT');
};
const test_17 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: 'Hi',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '5',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '1',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/INTRO2');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '2',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/UWC_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '3 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/PL_REDIRECT');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'SMS/INTRO1',
    incMessage: '4 ',
    incChannel: 'SMS',
  });
  expect(action.nextCode).toEqual('SMS/OL_REDIRECT');
};

describe('action/sms', function() {
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
    process.env['DATAWAREHOUSE_USERNAME'] = 'root';
    process.env['DATAWAREHOUSE_PASSWORD'] = 'password';
    process.env['DATAWAREHOUSE_DATABASE'] = 'conversation';
    process.env['DIRECTUS_URL'] = 'http://0.0.0.0:8055';
    process.env['DIRECTUS_ADMIN_TOKEN'] = 'token';
    clients.setKnex();
  });

  it('test_01: Test INIT for SMS', test_01);
  it('test_02: Test SMS/INTRO1_PRE', test_02);  
  it('test_03: Test SMS/INTRO', test_03);
  it('test_04: Test SMS/INTRO_E1', test_04);
  it('test_05: Test SMS/INTRO2', test_05);
  it('test_06: Test SMS/LBL1', test_06);
  it('test_07: Test SMS/LBL1_E1', test_07);
  it('test_08: Test SMS/LBL1_E2', test_08);
  it('test_09: Test SMS/LBL2', test_09);
  it('test_10: Test SMS/LBL2_E1', test_10);
  it('test_11: Test SMS/LBL3', test_11);
  it('test_12: Test SMS/LBL3_E1', test_12);
  it('test_13: Test SMS/LBL4', test_13);
  it('test_14: Test SMS/LBL4_E1', test_14);
  it('test_15: Test SMS/LBL4_E2', test_15);
  it('test_16: Test SMS/INTRO1_RESTART', test_16);
  it('test_17: Test SMS/INTRO1_RETURN', test_17);
});
