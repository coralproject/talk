#!/bin/bash

# Remove any .npmrc files
find /var/lib/nodejs -name .npmrc -exec rm {} \;
