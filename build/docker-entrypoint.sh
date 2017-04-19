#!/bin/bash

set -e

service xvfb start
if [ "$RAMDISK" ]; then
  cp -r $DEPLOY_DIR/bin $RAMDISK
fi
pm2-docker start process.yml --auto-exit --env $1
exec "$@"
