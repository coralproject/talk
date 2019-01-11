---
title: Troubleshooting Tips
permalink: /troubleshooting-tips/
---

## How do I find out what version I'm running?

If you visit https://<YOUR TALK INSTANCE>/api/v1, it will return the version you're running and the hash for the latest commit.

## I've installed Talk but I can't see the comment stream appear on my articles

* Make sure you've adding the correct domains to your Permitted Domains in Configure > Tech Settings
* Make sure you've correctly added the embed via your CMS to your article pages
* Check the console for any errors and you can file a bug via [support](mailto:support@coralproject.net) if you can't resolve the issue 

## My commenters are reporting they can't see the comment stream, but I'm able to

* If this seems to be isolated to one commenter, it could be related to 3rd party cookies 
* Post 4.x Talk doesn't require 3rd party cookies to be enabled. Check the version of Talk you're using and you might consider upgrading. 
* A quick fix in the meantime is to ask them to allow 3rd party cookies
* You could also try asking them to clear their browser cache


## My commenters are reporting that they cannot login to Talk

If you're using your own custom auth plugin: 

* Review the code and your server logs to ensure your plugin is working correctly. Check [our auth docs](/talk/integrating/authentication/) for more tips.
* Ensure that your JWT token settings, especially expiry, is being set correctly. You can troubleshoot JWT related issues with the [JWT Debugger](https://jwt.io/).
* See if you can isolate if it's a particular group of users that are experiencing this issue, e.g. mods, admins, subscribers? Confirm they have the appropriate permissions to comment.
* Note if this is a new issue that happened after an upgrade - did you read the [migration docs](/talk/migration/3/) and the [release notes](https://github.com/coralproject/talk/releases)? This might help you resolve the issue
* Confirm that users who are affected have the correct `username.status`. If users have status `UNSET`, this is related to a bug with upgrading from 3.x to 4.x that has affected some organizations. Read more here about [upgrading from 3.x to 4.x](/talk/migration/3/).
* If you're still experiencing issues, log a [support ticket](mailto:support@coralproject.net) so we can help diagnose the issue


If you're using `talk-plugin-auth`:

* See if you can isolate if it's a particular group of users that are experiencing this issue, e.g. mods, admins, subscribers? Confirm they have the appropriate permissions to comment.
* Note if this is a new issue that happened after an upgrade - did you read the [migration docs](/talk/migration/3/) and the [release notes](https://github.com/coralproject/talk/releases)? This might help you resolve the issue.
* If you're still experiencing issues, log a [support ticket](mailto:support@coralproject.net) so we can help diagnose the issue

If a user has been locked out due to too many failed login attempts:
* How long does the user have to wait before they will be allowed to login? 10 mins