const config = require('../config');
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
const channelName = 'another channel';
const participant1 = 'content-creator';
const participant2 = 'user';

( async () => {
    // 1. Create conversation
    const conversation = await client.conversations.conversations.create({ friendlyName: channelName });
    console.log(`New conversation created with id: ${conversation.sid}`);
    // 2. Add two participants
    const p1 = await client.conversations.conversations(conversation.sid).participants.create({ identity: participant1 });
    console.log(`Added participant with id: ${p1.sid}`);
    const p2 = await client.conversations.conversations(conversation.sid).participants.create({ identity: participant2 });
    console.log(`Added participant with id: ${p2.sid}`);
})();