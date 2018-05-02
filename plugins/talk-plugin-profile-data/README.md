---
title: talk-plugin-profile-data
layout: plugin
permalink: /plugin/talk-plugin-profile-data/
plugin:
    name: talk-plugin-profile-data
    default: true
    provides:
        - Client
        - Server
---

Provides a series of profile data management utilities to users via their
profile tab.

## Download My Profile

Enables the ability for users to download their profile data in a zip file from
their profile tab in the comment stream. Once clicked, an email will be sent
that contains a download link. Only one link can be generated every 7 days, and
the link will be valid for 24 hours.

The downloaded zip file will contain all the users comments in a CSV format
including those that have been rejected, withheld, or still in premod.
