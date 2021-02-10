const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const ngrok = require('ngrok');
const cors = require('cors');

const app = new express();
// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/token/:identity', (request, response) => {
  const identity = request.params.identity;
  const accessToken = new twilio.jwt.AccessToken(config.twilio.accountSid, config.twilio.apiKey, config.twilio.apiSecret);
  const chatGrant = new twilio.jwt.AccessToken.ChatGrant({
    serviceSid: config.twilio.chatServiceSid,
  });
  accessToken.addGrant(chatGrant);
  accessToken.identity = identity;
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify({
    token: accessToken.toJwt(),
    identity: identity
  }));
})

app.listen(config.port, () => {
  console.log(`Application started at localhost:${config.port}`);
});


// ============================================
// ============================================
// ====== HANDLE NEW-CONVERSATION HOOK ========
// ============================================
// ============================================
let client = new twilio(config.twilio.accountSid, config.twilio.authToken);

app.post('/inboundMessage', (req, res) => {
  console.log("Received a webhook:", req.body);
  if (req.body.EventType === 'onConversationAdded') {
    const me = "Tackleton";
    client.conversations.v1.conversations(req.body.ConversationSid)
      .participants
      .create({
        identity: me
      })
      .then(participant => console.log(`Added ${participant.identity} to ${req.body.ConversationSid}.`))
      .catch(err => console.error(`Failed to add a member to ${req.body.ConversationSid}!`, err));
  }

  console.log("(200 OK!)");
  res.sendStatus(200);
});

app.post('/outboundMessage', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
})



var ngrokOptions = {
  proto: 'http',
  addr: config.port
};

if (config.ngrokSubdomain) {
  ngrokOptions.subdomain = config.ngrokSubdomain
}

(async () => {
const ngrokUrl = await ngrok.connect(ngrokOptions);
console.log(ngrokUrl);
const res = await client.conversations.configuration
  .webhooks()
  .update({
     postWebhookUrl: `${ngrokUrl}/outboundMessage`,
     preWebhookUrl: `${ngrokUrl}/inboundMessage`,
     method: 'POST',
     filters: ['onMessageAdd', 'onMessageAdded']
   });
console.log(res);
})();

// Set up ngrok and update twilio webhooks
/*ngrok.connect(ngrokOptions).then(url => {
  console.log('ngrok url is ' + url);
  client.conversations.configuration
  .webhooks()
  .update({
     postWebhookUrl: `${url}/inboundMessage`,
     preWebhookUrl: `${url}/outboundMessage`,
     method: 'POST',
     filters: ['onMessageSend', 'onMessageSent']
   }).then(webhook => console.log(webhook.method));
  // Update twilio webhooks
}).catch(console.error);*/
