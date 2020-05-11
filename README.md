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
| DISABLE_ATTESTATION_WATCHER | Disable attestation watcher. `true` or `false` |
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
Follow instructions in the [Initialize ceremony](#initialize-real-ceremony) section to generate `current.params` ceremony file.
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

# Note. At start it builds client side stuff. It takes 30 seconds or so, during this time you will get 502 error.
```

## In case of WASM module changes
1. go to `phase2` folder in [phase2-bn254](https://github.com/tornadocash/phase2-bn254) and run the following command:
1. `wasm-pack build --release --target web -- --no-default-features --features wasm`
1. it will generate wasm modules in `pkg` folder, then you need to copy it to this project
1. `cp -r pkg/* <path_to_current_project>/lib/phase2 && cp pkg/phase2_bg.wasm <path_to_current_project>/static/_nuxt/lib/phase2/`

Example: `wasm-pack build --release --target web -- --no-default-features --features wasm && cp -r pkg/* ../../trusted-setup-nuxt/lib/phase2 && cp pkg/phase2_bg.wasm ../../trusted-setup-nuxt/static/_nuxt/lib/phase2/`


## Initialize REAL ceremony
1. Choose what contribition to use for the ceremony (it should already exist). Also choose what hash of future ethereum block we will use, tweet about it and calculate the VDF.
1. Make sure your machine has at least 150 GB RAM and 200 GB SSD.
1. Download the response file of the contribution. You can use `aria2c` accelerator for it.
1. `git clone https://github.com/tornadocash/phase2-bn254 && cd phase2-bn254`
1. `cd powersoftau`
1. `cargo run --release --bin beacon_constrained <challenge_file> last_response 28 256 <VDF output>`
1. `cargo run --release --bin prepare_phase2 last_response 28 256` it will generate `radix*` files. You can abort execution after `phase1radix2m15` calculation.
1. `cd ../phase2`
1. Make sure sure that withdraw.circom has additional constaints
1. `wget https://github.com/tornadocash/tornado-core/releases/download/v2.0/withdraw.json -O circuit.json`
1. `cp ../powersoftau/phase1radix2m15 .`
1. `cargo run --release --bin new circuit.json current.params`
1. The `current.params` file is your initial challenge file.
1. copy `current.params`, `circuit.json` and `phase1radix*` to `./server/snark_files` folder.

1. Then the phase2 goes. see [Production setup](#production-setup)

1. Before next step you can download all contributions and verify all of them localy.
1. Copy last contribution to `phase2-bn254/phase2` folder as `result.params`
1. `npx snarkjs setup --protocol groth`
1. `cargo run --release --bin export_keys result.params vk.json pk.json`
1. `cargo run --release --bin copy_json proving_key.json pk.json transformed_pk.json`
1. `cargo run --release --bin generate_verifier result.params Verifier.sol`
1. `git clone git@github.com:tornadocash/tornado-core.git`
1. `cd tornado-core && git checkout phase2`
1. Copy `transformed_pk.json`, `vk.json`, `circuit.json` and `Verifier.sol` to `tornado-core` project to the `build/circuits` folder.
1. `mv transformed_pk.json withdraw_proving_key.json`
1. `mv vk.json withdraw_verification_key.json`
1. `mv circuit.json withdraw.json`
1. `npm i`
1. `npm run build:circuit:bin`
1. That's it you can use `Verifier.sol`, `withdraw.json`, `withdraw_verification_key.json` and `withdraw_proving_key.bin` to deploy contract and the UI.

Note.
1. Your also need to use [special](https://github.com/tornadocash/websnark.git#4c0af6a8b65aabea3c09f377f63c44e7a58afa6d) version of websnark lib on the UI.
2. update WASM module.


## Initialize ceremony (`current.params` file creation) OUTDATED:
1. `git clone https://github.com/tornadocash/phase2-bn254 && cd phase2-bn254`
1. `git checkout ceremony`
1. go to `./powersoftau/src/bn256/mod.rs` and change `REQUIRED_POWER` to 15 (it's going to fit 36k constaints snark)
1. `cd powersoftau`
1. run `./test.sh`. After this step you will get many `phase1radix*` files.
1. Download [withdraw.json](https://github.com/tornadocash/tornado-core/releases/download/v2.0/withdraw.json) for required circuit to `./phase2` folder
1. `cd ../phase2`
1. `cp ../powersoftau/phase1radix* .`
1. `cargo run --release --bin new withdraw.json current.params`
1. The `current.params` file is your initial challenge file.
1. copy `current.params`, `withdraw.json` and `phase1radix*` to `./server/snark_files` folder.
1. `mv withdraw.json circuit.json`
