#!/bin/bash

set -e

if [[ "${CIRCLE_BRANCH}" == "master" ]]; then
  # Test using browserstack.
  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/chrome" yarn e2e-browserstack -- --env chrome
  sleep 2

  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/firefox" yarn e2e-browserstack -- --env firefox
  sleep 2

  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/safari" yarn e2e-browserstack -- --env safari
  sleep 2

  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/ie" yarn e2e-browserstack -- --env ie
  sleep 2

  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/edge" yarn e2e-browserstack -- --env edge
else
  # When browserstack is not available test locally using chrome headless.
  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/chrome" yarn e2e -- --env chrome-headless
fi
