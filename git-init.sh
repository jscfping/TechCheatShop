#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: sh git-init.sh <username>"
  exit 1
fi

USER=$1

git init
git config user.name "$USER"
git config user.email "$USER@gmail.com"
git lfs install

echo "* -text" > .gitattributes

echo "Done: user.name=$USER, user.email=$USER@gmail.com"

# sh git-init.sh alice


