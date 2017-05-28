#!/usr/bin/env bash

SCRIPT_PATH="$( cd "$(dirname "${0}")" ; pwd -P )"
DOCKERFILES_PATH="$( readlink -f $SCRIPT_PATH/../ )"
ROOT_PATH=${DOCKERFILES_PATH}

TAG=$1

if [ "$TAG" == "" ]; then
    echo "Usage: $0 tag"
    exit 255
fi

bash -c "find ${ROOT_PATH}/display_engine -type d -exec chmod a+rx {} \;"
bash -c "find ${ROOT_PATH}/display_engine -type f -exec chmod a+r {} \;"

IMAGE="mepc_nginx:$TAG"
cd $DOCKERFILES_PATH && docker build -t $IMAGE -f Dockerfile .
RET=$?

# push to private registry server when build successed
if [ "$RET" == "0" ]; then
    docker tag $IMAGE registry.gli.space:5000/$IMAGE
    docker push registry.gli.space:5000/$IMAGE
    RET=$?
    # delete the original image when push successed
    if [ "$RET" == "0" ]; then
        docker rmi $IMAGE
    fi
fi

