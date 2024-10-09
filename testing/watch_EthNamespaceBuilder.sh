#!/bin/bash
while inotifywait -e close_write ../EthNamespaceBuilder/dist/app.js; do
	sleep 4
	hurl --test ./EthNamespaceBuilder.hurl
done
