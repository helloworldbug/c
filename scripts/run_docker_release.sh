#!/usr/bin/env bash

TAG=$1

if [ "$TAG" == "" ]; then
    echo "Usage: $0 tag"
    exit 255
fi

SCRIPT_PATH="$( cd "$(dirname "${0}")" ; pwd -P )"
ROOT_PATH="$( readlink -f $SCRIPT_PATH/../ )"

IMAGE="mepc_build:$TAG"
docker run --rm $2 -v $ROOT_PATH:/mepc $IMAGE release
