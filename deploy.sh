#!/usr/bin/env bash

# Quick and dirty deployment script that copies built assets to gh-pages branch
# Eventually we will switch to the cleaner CI-based solution of official Globus static search portals.
#   VERY temporary workaround allows us to deploy something runnable even though the fancy build process fails due to search type bug.
#   https://github.com/globus/static-search-portal/pull/250

# abort on errors
set -e

# Verify that the script is running on the master branch (only)
BRANCH=$(git branch --show-current)
if [ -z "$BRANCH" ] || [ "$BRANCH" != "demo" ]; then
  echo 'Aborting script';
  exit 1;
fi

# build
npm run build

# navigate into the build output directory
cd out

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'Deploy newest version'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/abought/apecx-demo-static-search-portal.git main:gh-pages

cd -