const clients = require('../src/clients');
const { action } = require('../src/action');

const test_01 = async () => {
  let speaker = await clients.getSpeaker({phoneNumber:'123'});
  let conversations = await clients.getSpeakerConversations(speaker.id);

  let selectedConversation = conversations[conversations.length-1];
  console.log(selectedConversation);
  action({
    speakerId: speaker.id,
    prevInteractionCode: selectedConversation.prevCode,
    message: 'some message',
    channel: 'SMS',
  });

  let db = clients.getKnex();
  await db('conversations').where('id',conversations[0].id).del();
  await db('speakers').where('phone_number','123').del();
};

describe('action', function() {  
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
    process.env['DATAWAREHOUSE_USERNAME'] = 'root';
    process.env['DATAWAREHOUSE_PASSWORD'] = 'password';
    process.env['DATAWAREHOUSE_DATABASE'] = 'conversation';
    clients.setKnex();
  });

  it('action: Test getSpeaker', test_01);
});
