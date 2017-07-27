---
title: Installation Troubleshooting
permalink: /docs/install/troubleshooting/
---

This page tracks common issues that arise when installing Talk and provides resolutions.

## The Talk server seems to be working but the stream isn't showing up on my page.

Talk employs a _domain whitelist_ that controls which sites can contain comment threads. This prevents malicious folks from using your server to embed streams on unwanted pages.

If your comment thread isn't showing:

1. Log into your admin panel
1. Go to the Configure tab
1. Select the Tech Settings submenu
1. Ensure that your Domain is the Permitted Domains list

Note: if your site has multiple subdomains, listing the domain itself (ie: `mydomain.com`) will enable Talk on all subdomains. If you would like to restrict Talk to certain subdomains, you must list all of them here (ie: `thisone.mydomain.com thatone.mydomain.com`).
