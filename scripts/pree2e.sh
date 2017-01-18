#!/bin/bash

# install selenium
selenium-standalone install

# Creating Admin Test User
./bin/cli-users create --flag_mode --email "admin@test.com" --password "testtest" --name "AdminTestUser" --role "admin"

# Creating Moderator Test User
./bin/cli-users create --flag_mode --email "moderator@test.com" --password "testtest" --name "ModeratorTestUser" --role "moderator"

# Creating Commenter Test User
./bin/cli-users create --flag_mode --email "commenter@test.com" --password "testtest" --name "commenter@test.com"

./bin/cli -c .env-e2e serve --jobs &
