#!/bin/bash

REPORTS_FOLDER=${CIRCLE_TEST_REPORTS:-./test/e2e/reports}
CIRCLE_BRANCH=${CIRCLE_BRANCH_XX:-master}

# Amount of retries before failure.
E2E_MAX_RETRIES=${E2E_MAX_RETRIES:-1}

# Safari >= 8 has issues connecting to browserstack-local. Safari < 8 is too old.
# IE 64bit has issues with receiving keyboard input. Let's wait for them to fix it.
BROWSERS="chrome,firefox,edge" #ie safari

if [[ "${CIRCLE_BRANCH}" == "master" && -n "$BROWSERSTACK_KEY" ]]; then
  echo Testing on browserstack
  yarn e2e --reports-folder "$REPORTS_FOLDER" --bs-key "$BROWSERSTACK_KEY" --retries "$E2E_MAX_RETRIES" --browsers $BROWSERS
else
  # When browserstack is not available test locally using chrome headless.
  echo Testing locally
  yarn e2e --reports-folder "$REPORTS_FOLDER" --retries "$E2E_MAX_RETRIES" --headless
fi
