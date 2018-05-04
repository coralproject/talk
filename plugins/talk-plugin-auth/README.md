---
title: talk-plugin-auth
permalink: /plugin/talk-plugin-auth/
layout: plugin
plugin:
    name: talk-plugin-auth
    default: true
    provides:
        - Client
---

This provides the base plugin that is the basis for all auth based plugins that
utilize our internal authentication system.

To sync Talk auth with your own auth systems, you can use this plugin as a
template.

## GDPR Compliance

In order to facilitate compliance with the
[EU General Data Protection Regulation (GDPR)](https://www.eugdpr.org/), you
should review our [GDPR Compliance](/talk/integrating/gdpr/) guidelines.
