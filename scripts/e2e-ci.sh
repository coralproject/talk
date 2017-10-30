#!/bin/bash

CIRCLE_TEST_REPORTS=${CIRCLE_TEST_REPORTS:-./test/e2e/reports}
CIRCLE_BRANCH=${CIRCLE_BRANCH:-master}

if [[ "${CIRCLE_BRANCH}" == "master" ]]; then

  exitCode=0

  browserstack() {
    echo "-- Start e2e for $1 --"
    REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/$1" yarn e2e-browserstack -- --env "$1"

    # Determine exit code.
    result=$?
    if [ "$result" -gt "0" ]
    then
      echo "-- Success e2e for $1 --"
      exitCode=$result
    else
      echo "-- Failed e2e for $1 --"
    fi

    # Sleep a bit to let browserstack-local to close properly.
    sleep 2
  }

  # Test using browserstack.
  browserstack chrome
  browserstack firefox
  browserstack ie
  browserstack edge

  # Safari >= 8 has issues connecting to browserstack-local. Safari < 8 is too old.
  # browserstack safari

  exit $exitCode
else
  # When browserstack is not available test locally using chrome headless.
  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/chrome" yarn e2e -- --env chrome-headless

  # Will exit with status of last command.
  exit $?
fi
