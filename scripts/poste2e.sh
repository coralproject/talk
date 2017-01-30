#!/bin/bash

# If there is a PID file from the e2e tests...
if [ -e /tmp/talk-e2e.pid ]
then

  # Then kill the running talk server.
  kill $(cat /tmp/talk-e2e.pid)

fi
