#!/bin/bash

if [[ "${CIRCLE_BRANCH}" == "master" ]]; then

  exitCode=0

  browserstack() {
    REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/$1" yarn e2e-browserstack -- --env "$1"

    # Determine exit code.
    result=$?
    if [ "$result" -gt "0" ]
    then
      exitCode=$result
    fi

    # Sleep a bit to let browserstack-local to close properly.
    sleep 2
  }

  # Test using browserstack.
  browserstack chrome
  browserstack firefox
  browserstack ie

  # Safari >= 8 has issues connecting to browserstack-local. Safari < 8 is too old.
  # browserstack safari

  # Edge 14 & 15 randomly fails when switching from the login popup back to the main window.
  # browserstack edge

  exit $exitCode
else
  # When browserstack is not available test locally using chrome headless.
  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/chrome" yarn e2e -- --env chrome-headless

  # Will exit with status of last command.
  exit $?
fi
