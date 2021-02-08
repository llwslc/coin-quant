#!/bin/sh

if [ ! -d "./db" ];then
  git clone git@github.com:llwslc/coin-quant-db.git db
else
  echo "db already exists"
fi

