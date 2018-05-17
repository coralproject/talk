#!/bin/bash

ENV=$(echo ${DEPLOYMENT_GROUP_NAME} | cut -d- -f2)

# stop application
if [[ ${ENV} == 'prd' ]]; then
  systemctl stop ${APPLICATION_NAME}-3001
  systemctl stop ${APPLICATION_NAME}-3002
else
  systemctl stop ${APPLICATION_NAME}
fi
