#!/usr/bin/env bash
set -e

npm run start &

cp ./contribute /tmp
pushd /tmp

curl -o current.params http://localhost:8000/challenge
./contribute current.params new.params qwe
curl -F response=@new.params http://localhost:8000/response

curl -o current.params http://localhost:8000/challenge
./contribute current.params new.params qwes
curl -F response=@new.params http://localhost:8000/response

popd
