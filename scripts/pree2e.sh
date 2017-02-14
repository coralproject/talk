#!/bin/bash

# fail the e2e if any of these fail
set -e

# install selenium
selenium-standalone install --config=./selenium.config.js

# Clear db
mongo test --eval "db.dropDatabase()"

# Init application
./bin/cli setup --defaults

# Start the server and write the PID to a file to be killed later.
./bin/cli --pid /tmp/talk-e2e.pid serve --jobs &
