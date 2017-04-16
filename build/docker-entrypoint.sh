#!/bin/bash -e

service xvfb start
pm2-docker start process.yml --auto-exit --env $0
exec "$@"
