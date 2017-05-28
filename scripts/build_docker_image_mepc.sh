#!/usr/bin/env bash

TAG=$1

if [ "$TAG" == "" ]; then
    echo "Usage: $0 tag"
    exit 255
fi

SCRIPT_PATH="$( cd "$(dirname "${0}")" ; pwd -P )"
DOCKERFILES_PATH="$( readlink -f $SCRIPT_PATH/../Dockerfiles )"

IMAGE="mepc_build:$TAG"
echo start build image: $IMAGE ...
cd $DOCKERFILES_PATH && docker build -t $IMAGE -f Dockerfile .
RET=$?
echo end build image: $IMAGE, status: $RET
