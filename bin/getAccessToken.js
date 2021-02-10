
    const AccessToken = require('twilio').jwt.AccessToken;
    const config = require('../config');

    const ChatGrant = AccessToken.ChatGrant;
    
    // Used specifically for creating Chat tokens
    const identity = 'content-creator@example.com';
    
    // Create a "grant" which enables a client to use Chat as a given user,
    // on a given device
    const chatGrant = new ChatGrant({
      serviceSid: config.twilio.serviceSid,
    });
    
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
      config.twilio.accountSid,
      config.twilio.apiKey,
      config.twilio.apiSecret,
      {identity: identity}
    );
    
    token.addGrant(chatGrant);
    
    // Serialize the token to a JWT string
    console.log(token.toJwt());