const express = require('express');
const router = express.Router();
const oauth = require('oauth');

const _twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const _twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const twitterCallbackUrl = process.env.TWITTER_CALLBACK_URL;
const consumer = new oauth.OAuth("https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",_twitterConsumerKey, _twitterConsumerSecret, "1.0A", twitterCallbackUrl, "HMAC-SHA1");

router.get('/connect', (req, res) => {
  consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
    console.log('error, oauthToken, oauthTokenSecret, results', error, oauthToken, oauthTokenSecret, results)
    if (error) {
        res.send(error, 500);
    } else {
        req.session.oauthRequestToken = oauthToken;
        req.session.oauthRequestTokenSecret = oauthTokenSecret;
        const redirect = { 
            redirectUrl: `https://twitter.com/oauth/authorize?oauth_token=${req.session.oauthRequestToken}`
        }
        // res.send(redirect);
        res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken)
    }
  });
});
router.get('/twitter_callback', (req, res) => {
  consumer.getOAuthAccessToken(
  req.query.oauth_token,
  req.session.oauthRequestTokenSecret,
  req.query.oauth_verifier,
  (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
    if (error) {
        logger.error(error);
        res.send(error, 500);
    }
    else {
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret
        res.redirect('/sessions/home');
    }
  });
});

router.get('/home', function(req, res){
  consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
    if (error) {
      console.log('error', error)
        res.redirect('/sessions/connect');
        // res.send("Error getting twitter screen name : " + util.inspect(error), 500);
    } else {
        var parsedData = JSON.parse(data);
        console.log('name', parsedData.name)
        console.log('screen_name', parsedData.screen_name)
        console.log('description', parsedData.description)

      // req.session.twitterScreenName = response.screen_name;    
      res.send('You are signed in: @' + parsedData.screen_name);
    } 
  });
});
module.exports = router;
