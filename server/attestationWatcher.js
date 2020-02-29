const fs = require('fs')
const Twitter = require('twitter')

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
  NUXT_ENV_TWITTER_HASHTAG,
  TWITTER_INTERVAL_ATTESTATION,
  NODE_ENV
} = process.env

const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

const { Contribution } = require('./models')

function attestationWatcher() {
  // get the last saved tweet
  let initTweet
  try {
    initTweet = require('/tmp/lastTweet.json').lastTweet
  } catch (e) {
    initTweet = 0
  }

  const params = {
    since_id: initTweet,
    q: `#${NUXT_ENV_TWITTER_HASHTAG} -filter:retweets`,
    result_type: 'recent',
    count: 100
  }

  // search tweets with params
  client.get('search/tweets', params, async function(error, tweets, response) {
    if (!error) {
      for (const tweet of tweets.statuses) {
        if (NODE_ENV === 'development') {
          console.log(
            '\x1B[36m%s\x1B[0m',
            `${tweet.text} https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
          )
        }

        // find the contribution id in a tweet
        let matchTweetContributionId = null
        let tweetContributionId = null

        if ((matchTweetContributionId = tweet.text.match(/#([0-9]+)/))) {
          tweetContributionId = Number(matchTweetContributionId[1])
        }

        // if found the contribution id then search a contribution
        if (tweetContributionId) {
          // try update the database record by id
          try {
            const result = await Contribution.update(
              { attestation: tweet.id_str },
              {
                where: {
                  id: tweetContributionId,
                  handle: tweet.user.screen_name,
                  attestation: null
                }
              }
            )
            if (result[0]) {
              console.log(
                `Succesful attestation #${tweetContributionId} https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
              )
            }
          } catch (error) {
            console.error(error)
          }
        }
      }

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
