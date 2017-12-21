#!/bin/bash

REPORTS_FOLDER=${CIRCLE_TEST_REPORTS:-./test/e2e/reports}
CIRCLE_BRANCH=${CIRCLE_BRANCH:-master}
E2E_DISABLE=${E2E_DISABLE:-false}

# Amount of retries before failure.
E2E_MAX_RETRIES=${E2E_MAX_RETRIES:-1}

# Timeout for WaitForConditions.
E2E_WAIT_FOR_TIMEOUT=${E2E_WAIT_FOR_TIMEOUT:-10000}

# Safari >= 8 has issues connecting to browserstack-local. Safari < 8 is too old.
# IE 64bit has issues with receiving keyboard input. Let's wait for them to fix it.
E2E_BROWSERS=${E2E_BROWSERS:-chrome,firefox,edge} #ie safari

if [[ "${E2E_DISABLE}" == "true" ]]; then
  echo E2E is disabled.
  exit
fi

if [[ "${CIRCLE_BRANCH}" == "master" && -n "$BROWSERSTACK_KEY" ]]; then
  echo Testing on browserstack
  yarn e2e --reports-folder "$REPORTS_FOLDER" --bs-key "$BROWSERSTACK_KEY" --retries "$E2E_MAX_RETRIES" --timeout "$E2E_WAIT_FOR_TIMEOUT" --browsers "$E2E_BROWSERS"
else
  # When browserstack is not available test locally using chrome headless.
  echo Testing locally
  yarn e2e --reports-folder "$REPORTS_FOLDER" --retries "$E2E_MAX_RETRIES" --headless
fi
