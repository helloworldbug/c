#!/usr/bin/env bash

echo "update submodules..."
git submodule update --init --recursive
echo "update submodules end."

echo "submoduls:"
echo `git submodule status`

