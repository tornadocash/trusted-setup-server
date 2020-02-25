const fs = require('fs')
const Twitter = require('twitter')

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_HASHTAG,
  TWITTER_INTERVAL_ATTESTATION
} = process.env

const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

const { Contribution } = require('./models')

async function attestationWatcher() {
  // get the last saved tweet
  let initTweet
  try {
    initTweet = require('/tmp/lastTweet.json').lastTweet
  } catch (e) {
    initTweet = process.env.LAST_TWEET
  }

  // get all contributions without attestation
  const contributions = await Contribution.findAll({
    where: {
      socialType: 'twitter',
      attestation: null
    },
    attributes: ['id', 'handle', 'socialType', 'attestation']
  })

  const params = {
    since_id: initTweet,
    q: `#${TWITTER_HASHTAG} -filter:retweets`,
    result_type: 'recent',
    count: 100
  }

  // search tweets with params
  client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
      tweets.statuses.forEach((tweet) => {
        contributions.forEach((contribution) => {
          // compare account compliance
          if (contribution.handle === tweet.user.screen_name) {
            // update the database record by id
            Contribution.update({ attestation: tweet.id_str }, { where: { id: contribution.id } })
            console.log(
              `Succesful attestation https://${contribution.socialType}.com/${contribution.handle}/status/${tweet.id_str}`
            )
          }
        })
      })

      // save the last tweet received
      fs.writeFileSync(
        '/tmp/lastTweet.json',
        JSON.stringify({ lastTweet: tweets.search_metadata.max_id_str })
      )
    } else {
      console.error('attestationWatcher error', error)
    }
  })

  setTimeout(() => {
    attestationWatcher()
  }, TWITTER_INTERVAL_ATTESTATION)
}

module.exports = attestationWatcher
