#!/usr/bin/env bash
set -e

npm run start &

cp ./contribute /tmp
pushd /tmp

curl -o challenge http://localhost:8000/challenge
./contribute old.params new.params qwe
curl -F response=@response http://localhost:8000/response

curl -o challenge http://localhost:8000/challenge
./contribute old.params new.params qwes
curl -F response=@response http://localhost:8000/response

popd
