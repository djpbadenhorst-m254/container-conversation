const clients = require('../../src/clients');
const { determineAction } = require('../../src/action');

let action;
const test_01 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'INIT',
    incMessage: 'Hi ',
    incChannel: 'WHATSAPP',
  });
  expect(action.nextCode).toEqual('WAP/INTRO1');
};
const test_02 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1',
    incMessage: 'Hi',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1',
    incMessage: '5',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1',
    incMessage: '1',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO2');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1',
    incMessage: '2',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/UWC_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1',
    incMessage: '3',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/PL_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1',
    incMessage: '4',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/OL_REDIRECT');
};
const test_03 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_E1',
    incMessage: 'Hi',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_E1',
    incMessage: '5',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_E1',
    incMessage: '1',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO2');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_E1',
    incMessage: '2',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/UWC_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_E1',
    incMessage: '3',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/PL_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_E1',
    incMessage: '4',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/OL_REDIRECT');
};
const test_04 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/INTRO2',
      incMessage: ' Dirk Badenhorst',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL1');

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
const test_05 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1',
      incMessage: 'something',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL1_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1',
      incMessage: '10',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL1_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1',
      incMessage: '100000',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2');

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
const test_06 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1_E1',
      incMessage: 'something',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL1_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1_E1',
      incMessage: '10',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL1_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1_E1',
      incMessage: '0',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/INTRO1_RESTART');
    
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1_E1',
      incMessage: '100000',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2');

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
      prevCode: 'WAP/LBL1_E2',
      incMessage: 'something',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL1_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1_E2',
      incMessage: '10',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL1_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1_E2',
      incMessage: '0',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/INTRO1_RESTART');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL1_E2',
      incMessage: '100000',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2');

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
    let speakerData;
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2',
      incMessage: 'something',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2',
      incMessage: '1',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Private Vehicle');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2',
      incMessage: '2',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Commercial Truck');
    
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2',
      incMessage: '3',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('PSV or Uber');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2',
      incMessage: '4',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2_DNQ2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2',
      incMessage: '5',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2_DNQ1');
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
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2_E1',
      incMessage: 'something',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2_E1',
      incMessage: '1',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Private Vehicle');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2_E1',
      incMessage: '2',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('Commercial Truck');
    
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2_E1',
      incMessage: '3',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL3');
    speakerData = await clients.getSpeakerData(speaker.id);
    expect(speakerData.owned_vehicle_type).toEqual('PSV or Uber');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2_E1',
      incMessage: '4',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2_DNQ2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL2_E1',
      incMessage: '5',
      incChannel: 'WHATSAPP'
    });
    expect(action.nextCode).toEqual('WAP/LBL2_DNQ1');
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
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL3',
      incMessage: 'something',
      incChannel: 'WHATSAPP',
    });
    expect(action.nextCode).toEqual('WAP/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL3',
      incMessage: '0',
      incChannel: 'WHATSAPP',
    });
    expect(action.nextCode).toEqual('WAP/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL3',
      incMessage: '1990',
      incChannel: 'WHATSAPP',
    });
    expect(action.nextCode).toEqual('WAP/LBL4');

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
const test_11 = async () => {
  try {
    let speaker = await clients.getSpeaker({phoneNumber:'123'});
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL3_E1',
      incMessage: 'something',
      incChannel: 'WHATSAPP',
    });
    expect(action.nextCode).toEqual('WAP/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL3_E1',
      incMessage: '0',
      incChannel: 'WHATSAPP',
    });
    expect(action.nextCode).toEqual('WAP/LBL3_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL3_E1',
      incMessage: '1990',
      incChannel: 'WHATSAPP',
    });
    expect(action.nextCode).toEqual('WAP/LBL4');

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
    await clients.updateSpeakerData(speaker.id, {
      first_name: 'John',
      last_name: 'Smith',
      initial_loan_amount:100000
    });
    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL4',
      incMessage: 'something',
    });
    expect(action.nextCode).toEqual('WAP/LBL4_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL4',
      incMessage: '99999',
    });
    expect(action.nextCode).toEqual('WAP/LBL4_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL4',
      incMessage: '150000',
    });
    expect(action.nextCode).toEqual('WAP/LBL_RESULTS_PASS');

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
      prevCode: 'WAP/LBL4_E1',
      incMessage: 'something',
    });
    expect(action.nextCode).toEqual('WAP/LBL4_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL4_E1',
      incMessage: '99999',
    });
    expect(action.nextCode).toEqual('WAP/LBL4_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL4_E1',
      incMessage: '150000',
    });
    expect(action.nextCode).toEqual('WAP/LBL_RESULTS_PASS');

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
      prevCode: 'WAP/LBL4_E2',
      incMessage: 'something',
    });
    expect(action.nextCode).toEqual('WAP/LBL4_E2');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL4_E2',
      incMessage: '99999',
    });
    expect(action.nextCode).toEqual('WAP/LBL4_E1');

    action = await determineAction({
      speakerId: speaker.id,
      prevCode: 'WAP/LBL4_E2',
      incMessage: '150000',
    });
    expect(action.nextCode).toEqual('WAP/LBL_RESULTS_PASS');

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
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RETURN',
    incMessage: 'Hi',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RETURN',
    incMessage: '5',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RETURN',
    incMessage: '1',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO2');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RETURN',
    incMessage: '2',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/UWC_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RETURN',
    incMessage: '3',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/PL_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RETURN',
    incMessage: '4',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/OL_REDIRECT');
};
const test_16 = async () => {
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RESTART',
    incMessage: 'Hi',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RESTART',
    incMessage: '5',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO1_E1');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RESTART',
    incMessage: '1',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/INTRO2');
  
  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RESTART',
    incMessage: '2',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/UWC_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RESTART',
    incMessage: '3',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/PL_REDIRECT');

  action = await determineAction({
    speakerId: '123',
    prevCode: 'WAP/INTRO1_RESTART',
    incMessage: '4',
    incChannel: 'WHATSAPP'
  });
  expect(action.nextCode).toEqual('WAP/OL_REDIRECT');
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

  it('test_01: Test INIT for WHATSAPP', test_01);
  it('test_02: Test WAP/INTRO1', test_02);
  it('test_03: Test WAP/INTRO1_E1', test_03);
  it('test_04: Test WAP/INTRO2', test_04);
  it('test_05: Test WAP/LBL1', test_05);
  it('test_06: Test WAP/LBL1_E1', test_06);
  it('test_07: Test WAP/LBL1_E2', test_07);
  it('test_08: Test WAP/LBL2', test_08);
  it('test_09: Test WAP/LBL2_E1', test_09);
  it('test_10: Test WAP/LBL3', test_10);
  it('test_11: Test WAP/LBL3_E1', test_11);
  it('test_12: Test WAP/LBL4', test_12);
  it('test_13: Test WAP/LBL4_E1', test_13);
  it('test_14: Test WAP/LBL4_E2', test_14);
  it('test_15: Test WAP/INTRO1_RETURN', test_15);
  it('test_16: Test WAP/INTRO1_RESTART', test_16);
});
