#!/bin/bash

set -e

if [[ -z "${BROWSERSTACK_KEY}" ]]; then
  # When browserstack is not available test locally using chrome headless.
  yarn e2e -- --env chrome-headless
else
  # Test using browserstack.
  yarn e2e-browserstack -- --env chrome
  sleep 2

  yarn e2e-browserstack -- --env firefox
  sleep 2

  yarn e2e-browserstack -- --env safari
  sleep 2

  yarn e2e-browserstack -- --env ie
  sleep 2

  yarn e2e-browserstack -- --env edge
fi
