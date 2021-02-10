// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure
const config = require('../config');

const channelToDelete = 'CHd1950a90ccd94c029c7348496130aa58';
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

client.chat.services(config.twilio.chatServiceSid)
           .channels(channelToDelete)
           .remove();