#!/bin/bash
while inotifywait -e close_write ../PermissionsSyncer/dist/app.js; do
	sleep 4
	hurl --test ./PermissionsSyncer.hurl
done
