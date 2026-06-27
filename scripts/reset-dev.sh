#!/bin/sh
set -eu

docker compose -f compose.yml down -v --remove-orphans
docker compose -f compose.yml up -d --build
