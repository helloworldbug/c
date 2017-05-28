#!/usr/bin/env bash

MEPC_PATH=/mepc

cd $MEPC_PATH

bash -c "./scripts/update_submodule.sh"

sed -e "s/npm/cnpm/g"  ./display_engine/scripts/build.sh > ./display_engine/scripts/build_tmp.sh

sed -e "s/npm/cnpm/g" ./scripts/build.sh > ./scripts/build_tmp.sh
sed -e "s/build.sh/build_tmp.sh/g" -i.bak ./scripts/build_display_engine.sh

chmod +x ./display_engine/scripts/build_tmp.sh
chmod +x ./scripts/build_tmp.sh

cd ./display_engine && cnpm install
cd $MEPC_PATH
cnpm install
./scripts/build_tmp.sh $1

RET=$?

if [ "$RET" == "0" ]; then
    echo "BUILD OK."
else
    echo "BUILD ERROR."
fi

rm ./display_engine/scripts/build_tmp.sh
rm ./scripts/build_tmp.sh
mv ./scripts/build_display_engine.sh.bak ./scripts/build_display_engine.sh
