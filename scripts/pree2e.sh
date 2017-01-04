#!/bin/bash

# install selenium
selenium-standalone install

# Creating Admin Test User
./bin/cli-users create --flag_mode --email "admin@test.com" --password "test" --name "Admin Test User" --role "admin"

# Creating Moderator Test User
./bin/cli-users create --flag_mode --email "moderator@test.com" --password "test" --name "Moderator Test User" --role "moderator"

# Creating Commenter Test User
./bin/cli-users create --flag_mode --email "commenter@test.com" --password "test" --name "commenter@test.com"

npm start &
