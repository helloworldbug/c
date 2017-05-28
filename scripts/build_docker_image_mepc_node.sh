#!/usr/bin/env bash

SCRIPT_PATH="$( cd "$(dirname "${0}")" ; pwd -P )"
DOCKERFILES_PATH="$( readlink -f $SCRIPT_PATH/../Dockerfiles )"
cd $DOCKERFILES_PATH && docker build -t mepc_node:latest -f Dockerfile_mepc_node .
RET=$?

if [ "$RET" == "0" ]; then
    docker tag mepc_node:latest registry.gli.space:5000/mepc_node:latest
    docker push registry.gli.space:5000/mepc_node:latest
fi

