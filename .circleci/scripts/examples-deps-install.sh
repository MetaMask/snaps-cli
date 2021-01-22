#!/usr/bin/env bash

set -x
set -e
set -u
set -o pipefail

cd ./examples

find . -type d -maxdepth 1 -exec sh -c '
    cd "$1"
    yarn --frozen-lockfile --ignore-scripts
  ' sh {} \;
