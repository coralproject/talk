#!/bin/bash

# Validate deploy
ENV=$(echo ${DEPLOYMENT_GROUP_NAME} | awk -F\- '{print $NF}')
until [[ $(curl -sL -w "%{http_code}" -H "Host: ${APPLICATION_NAME}.${ENV}.micro.aws.nymetro.com" http://127.0.0.1/health-check -o /dev/null) = "200" ]]; do :; done
