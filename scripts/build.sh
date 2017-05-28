#!/usr/bin/env bash

SCRIPT_PATH="$( cd "$(dirname "${0}")" ; pwd -P )"
SCRIPT_NAME=`basename "$0"`
ROOT_PATH="$( readlink -f $SCRIPT_PATH/../ )"
NODE_MOD_PATH=$ROOT_PATH/node_modules

TASK="release"

if [ ! -d "$NODE_MOD_PATH" ]; then
	echo "node_modules not installed. run npm install..."
	cd "$ROOT_PATH" && npm install && npm install --save name
fi

if [ "$1" != "" ];then
	TASK=$1
fi

if [ "$TASK" != "release" -a "$TASK" != "serve" ]; then
    echo "Usage: $SCRIPT_NAME release|serve"
    exit 255
fi

if [ "$TASK" == "release" ]; then
   DISPLAY_ENGINETASK="release"
else
   DISPLAY_ENGINETASK="develop"
fi

# build display_engine js files
BUILD_DISPLAY_ENGINE_CMD="$SCRIPT_PATH/build_display_engine.sh $DISPLAY_ENGINETASK"
echo "build display_engine js file start ... cmd is: $BUILD_DISPLAY_ENGINE_CMD"
bash -c "$BUILD_DISPLAY_ENGINE_CMD"
echo "build display_engine js file end"

GRUNT_TASK=""
if [ "$TASK" == "release" ]; then
   GRUNT_TASK="build"
else
   GRUNT_TASK="serve"
fi
echo "run grunt task $GRUNT_TASK"
"grunt" $GRUNT_TASK
RET=$?
echo "run grunt task $GRUNT_TASK end. status = $RET"

exit $RET
