#!/bin/sh

cd db

git pull --ff-only

cd ..

node app

