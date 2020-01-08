#!/usr/bin/env bash
set -e

./new_constrained challenge
npm run start &

cp ./beacon_constrained /tmp
pushd /tmp

curl -o challenge http://localhost:8000/challenge
./beacon_constrained challenge response
curl -F response=@response http://localhost:8000/response

curl -o challenge http://localhost:8000/challenge
./beacon_constrained challenge response
curl -F response=@response http://localhost:8000/response

popd

cat response0 response1 > transcript
./verify transcript