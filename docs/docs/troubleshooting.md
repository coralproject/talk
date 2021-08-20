---
title: Troubleshooting Tips
---

## How do I find out what version I'm running?

If you visit one of the following endpoints, Coral will return the version you're running and the hash for the latest commit.

- `/api/v1` (works for 4.x.x versions)
- `/api/version` (works for 5.x.x versions)

## I've installed Coral but I can't see the comment stream appear on my articles

- Make sure you've adding the correct domains to your Permitted Domains
- Make sure you've correctly added the embed via your CMS to your article pages
- Check the console for any errors and you can file a bug via [support](mailto:support@coralproject.net) if you can't resolve the issue

## My commenters are reporting they can't see the comment stream, but I'm able to

- If this seems to be isolated to one commenter, it could be related to 3rd party cookies
- Post 4.x Talk doesn't require 3rd party cookies to be enabled. Check the version of Talk you're using and you might consider upgrading.
- A quick fix in the meantime is to ask them to allow 3rd party cookies
- You could also try asking them to clear their browser cache

## My commenters are reporting that they cannot login to Coral

This depends greatly on what version of Coral you are using and which authentication strategies you've enabled. Some things to check are:

- If using SSO, ensure that your JWT token settings, especially expiry, is being set correctly. You can troubleshoot JWT related issues with the [JWT Debugger](https://jwt.io/).
- See if you can isolate if it's a particular group of users that are experiencing this issue, e.g., mods, admins, subscribers? Confirm they have the appropriate permissions to comment.
- Note if this is a new issue that happened after an upgrade - did you read the [release notes](https://github.com/coralproject/talk/releases) and confirm that any required manual or automatic database migrations run?
- If you're still experiencing issues, log a [support ticket](mailto:support@coralproject.net) so we can help diagnose the issue

If a user has been locked out due to too many failed login attempts:

- How long does the user have to wait before they will be allowed to login? 10 mins

## An Admin user logged in via SSO is not automatically logged in to Coral Admin from comments MODERATE button

An admin-authorized user logged in to comments via SSO can only be logged in to the Coral Admin tool automatically if “Coral Admin” is checked under "Configure" -> "Authentication" -> “Login with Single Sign On“.

## A user on my site has a new SSO 'user.id' but they cannot log in anymore (Duplicate Email error)

If you have changed the SSO `user.id` associated with the users email address, Coral will attempt to add the new user, but will fail because the user's email address is already in the system.  The simplest way to fix this problem is to change the email address (`user.email`) associated with the _old_ `user.id` to something else.  This can be done using the GraphQL API `updateUserEmail` mutation.

