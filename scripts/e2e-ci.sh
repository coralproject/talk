#!/bin/bash

CIRCLE_TEST_REPORTS=${CIRCLE_TEST_REPORTS:-./test/e2e/reports}
CIRCLE_BRANCH=${CIRCLE_BRANCH:-master}

MAX_RETRIES=1

# Safari >= 8 has issues connecting to browserstack-local. Safari < 8 is too old.
BROWSERS="chrome firefox ie edge" #safari

if [[ "${CIRCLE_BRANCH}" == "master" ]]; then

  # List of failed browsers
  failedBrowsers=

  # List of succeeded browsers
  succeededBrowsers=

  exitCode=0

  browserstack() {

    # Current number of tries.
    try=${2:-0}

    echo "-- Start e2e for $1 #$try --"

    REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/$1" yarn e2e-browserstack --env "$1"

    # Determine exit code.
    result=$?
    if [ "$result" -gt "0" ]; then
      echo "-- Failed e2e for $1 #$try --"

      # Try again of MAX_RETRIES is not reached.
      if [ "$try" -lt $MAX_RETRIES ]; then
        let try=try+1
        browserstack "$1" "$try"
        return
      fi

      # Failed, add to list of failed browsers.
      failedBrowsers="$failedBrowsers $1"

      # Remember exit code.
      exitCode=$result
    else
      echo "-- Success e2e for $1 #$try --"

      # Succeeded, add to list of succeeded browsers.
      succeededBrowsers="$succeededBrowsers $1"
      eval "browser_${1}_succeeded_at=$try"
    fi

    # Sleep a bit to let browserstack-local to close properly.
    sleep 2
  }

  # Test using browserstack.
  for browser in $BROWSERS
  do
    browserstack "$browser"
  done


  # Print information about succeeded browsers.
  for x in $succeededBrowsers
  do
    echo "Succeeded $x at try #$(eval "echo \$browser_${x}_succeeded_at")"
  done

  # Print information about failed browsers.
  for x in $failedBrowsers
  do
    echo "Failed $x"
  done
  exit $exitCode
else
  # When browserstack is not available test locally using chrome headless.
  REPORTS_FOLDER="$CIRCLE_TEST_REPORTS/chrome" yarn e2e -- --env chrome-headless

  # Will exit with status of last command.
  exit $?
fi
