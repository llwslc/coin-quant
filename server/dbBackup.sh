#!/bin/sh

exit 0

cd db

rm -rf dbUpdate
mkdir dbUpdate
cp dklines.db dbUpdate/
cd dbUpdate

zip dklines.zip dklines.db
rm dklines.db

git init
git add -A
git commit -m 'backup'

git push -f git@github.com:llwslc/coin-quant-db.git master:master

cd ..
rm -rf dbUpdate
