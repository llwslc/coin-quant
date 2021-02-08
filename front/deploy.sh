#!/bin/sh

npm run build

cd build

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:llwslc/coin-quant-front.git master:master
