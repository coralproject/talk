#!/bin/bash

# fail the e2e if any of these fail
set -e

# install selenium
selenium-standalone install --config=./selenium.config.js

# Init application
./bin/cli setup --defaults

# Creating Admin Test User
./bin/cli users create --flag_mode --email "admin@test.com" --password "testtest" --name "AdminTestUser" --role "ADMIN"

# Creating Moderator Test User
./bin/cli users create --flag_mode --email "moderator@test.com" --password "testtest" --name "ModeratorTestUser" --role "MODERATOR"

# Creating Commenter Test User
./bin/cli users create --flag_mode --email "commenter@test.com" --password "testtest" --name "CommenterTestUser"

# Start the server and write the PID to a file to be killed later.
./bin/cli --pid /tmp/talk-e2e.pid serve --jobs &
