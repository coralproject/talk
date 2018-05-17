#!/bin/bash

ENV=$(echo ${DEPLOYMENT_GROUP_NAME} | cut -d- -f2)

# start application
if [[ ${ENV} == 'prd' ]]; then
  systemctl start ${APPLICATION_NAME}-3001
  systemctl start ${APPLICATION_NAME}-3002
else
  systemctl start ${APPLICATION_NAME}
fi
