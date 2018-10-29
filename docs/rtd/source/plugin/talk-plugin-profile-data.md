
# talk-plugin-profile-data

[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-profile-data/)
```
    name: talk-plugin-profile-data
    default: true
    provides:
        - Server
        - Client
```


Provides a series of profile data management utilities to users via their
profile tab.

## Download My Profile

Enables the ability for users to download their profile data in a zip file from
their profile tab in the comment stream. Once clicked, an email will be sent
that contains a download link. Only one link can be generated every 7 days, and
the link will be valid for 24 hours.

The downloaded zip file will contain all the users comments in a CSV format
including those that have been rejected, withheld, or still in pre-moderation.

## GDPR Compliance

In order to facilitate compliance with the
[EU General Data Protection Regulation (GDPR)](https://www.eugdpr.org/), you
should review our [GDPR Compliance](../03-08-gdpr.html) guidelines. This
plugin can work with its client plugin disabled and then directly integrated
with existing workflows for an organization of any size through use of the API
that this plugin provides.
