# Tornado.cash Trusted Setup Ceremony app

> zk-SNARKs require a pre-existing setup between the prover and verifier. A set of public parameters define the “rules of the game” for the construction of zk-SNARKs. This app allows everyone to contribute with your source of entropy so that tornado.cash can be trustless.

## Environment variables
The app can use `.env.development` and `.env.production`. What file will be used depends on `NODE_ENV` variable.
For command `yarn dev` the `.env.development` is used. The `yarn start` uses `.env.production`.

| ENV_VAR | Description |
| --- | --- |
| DISABLE_S3 | Disable contributions uploading to AWS S3. `true` or `false` |
| AWS_ACCESS_KEY_ID | AWS access key |
| AWS_SECRET_ACCESS_KEY | AWS secret key |
| AWS_S3_BUCKET | AWS S3 bucket where the contributions will be uploaded |
| MYSQL_USER | Mysql user the app uses. Notice, you don't need mysql db for development. The app will use local sqlite db in dev mode. Local db is stored in `db.development.sqlite` file. |
| MYSQL_PASSWORD | Mysql password for MYSQL_USER |
| MYSQL_DATABASE | Mysql database |
| TWITTER_CONSUMER_KEY | Twitter consumer API key. [Twitter app](https://developer.twitter.com/en/apps) |
| TWITTER_CONSUMER_SECRET | Twitter consumer API secret |
| TWITTER_CALLBACK_URL | Twitter callback URL. The app handles the `/api/oauth_callback/twitter` endpoint. Feel free to change domain name and protocol though |
| GITHUB_CLIEND_ID | Github client id. [How to create Github OAuth app](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) |
| GITHUB_CLIENT_SECRET | Github client secret |
| GITHUB_CALLBACK_URL | Github callback URL. The app handles the `/api/oauth_callback/github` endpoint. Feel free to change domain name and protocol though |
| SESSION_SECRET | A random string that will be used by [express-session](https://www.npmjs.com/package/express-session#secret) to sign the session ID cookie. |

## Development setup

``` bash
$ yarn install

# Edit all necessary environment variables. See the explanation above.
$ cp .env.example .env.development

# serve with hot reload at localhost:3000
$ yarn dev
```

## Production setup
``` bash
# Edit all necessary environment variables. See the explanation above.
$ cp .env.example .env.production

# Run Nginx + Letsencrypt containers to serve https requests to the app
$ cd frontend 
$ docker-compose up -d
$ cd ..

# Set VIRTUAL_HOST and LETSENCRYPT_HOST variables in the app's docker-compose.yml file
# Run the app and mysql database containers. It will use the MYSQL_USER, MYSQL_PASSWORD and MYSQL_DATABASE vars you specified in .env.production file.
$ docker-compose up -d
```
