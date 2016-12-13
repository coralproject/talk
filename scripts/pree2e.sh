#!/bin/bash

# install selenium
../node_modules/selenium-standalone/bin/selenium-standalone install

# start the app server
npm start &
