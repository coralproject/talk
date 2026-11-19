---
title: Social and Email Authentication
---

## Authentication Strategies

There are several strategies to choose from when it comes to user authentication. Login methods can be enabled or disabled for both the **Coral Admin** and the **Comment Stream** separately thus allowing you to use different methods for different user groups.

You can also use "Allow Registration" to restrict or allow users that have not signed up before to register and create new user accounts.

To configure authentication for your instance of Coral, go to **Configure** > **Authentication**.

## Login with email authentication

Best when you want Coral to manage all user registration, creation and authentication. Requires the least amount of setup and configuration. Users register by creating a Username (must be unique across users, no spaces or special chars), Email, and Password. All user details are stored in Coral's database.

By default - users are sent a verification email and are prompted to verify their email address, however completing the email verification step is not required to submit comments.

## Login with OpenID Connect

Allows integration with your existing OpenID Connect authentication provider. When enabled this strategy adds a "Login with \_\_\_", button to Coral's login modal with the value you've specified for `Provider Name`.

With OpenID Connect authentication is handled by passing an access token parameter to the comment stream embed when placing the call to render it. To learn more please visit: https://openid.net/connect/

## Login with Single Sign On

When you want users to authenticate via your existing identity system, and be automatically registered/logged into Coral. Users register, login, and manage their user details on your existing site, your user database maintains the source of truth for all user information. Users are created and updated in Coral via JWT tokens passed from your auth service to Coral.

Requires advanced configuration, please see: [Single Sign On](/sso)

## Login with Google & Facebook

Allows users to use existing social media account to sign in. Requires you to setup API keys with social sign on provider, and configure your API keys in Coral.

Users register and login via a _“Sign in with ….”_, and are not required to set a password if Email based authentication is not enabled. Users with social accounts are prompted to associate an email address with their social profile to enable notifications.

## Login with ATproto or Bluesky

Allows users to sign in with their handle from any ATproto service, such as Bluesky or a self-hosted PDS. Users enter their handle, approve the sign in on their own authorization server, and are returned to Coral.

No API keys are needed. Coral identifies itself with a client metadata document, whose URL is shown in the settings as the **Client ID**. It must be publicly reachable over HTTPS. Each Coral tenant has its own Client ID.

Settings:

- **Client name** and **Logo URL**: shown to users by authorization servers that trust your site. Most authorization servers, including Bluesky's, show the Client ID URL and no logo for sites they haven't chosen to trust. The client name uses your organization name when left empty.
- **Atproto handle suggestions**: the host that suggests handles while users type them. It must serve `app.bsky.actor.searchActorsTypeahead`. It defaults to Bluesky's public AppView, `https://public.api.bsky.app`, so only accounts it knows about are suggested. What users type is sent to this host from their browser. Leave it empty to turn suggestions off.

Like Google & Facebook, users are matched by their ATproto account, not by email address. If the email address from a new user's account already belongs to a Coral account, they can link the two by entering that account's password. This needs **Login with email** to be enabled, and registration to be allowed. Users who sign up are asked to choose a username. When **Login with email** is enabled for the comment stream they will also be asked to set a password.

Signing out of Coral also ends the user's session with their authorization server, so the next sign in starts a new authorization.

Coral must run with `--no-experimental-fetch`, which the Docker image sets in `NODE_OPTIONS`. If your deployment sets its own `NODE_OPTIONS`, include `--openssl-legacy-provider --no-experimental-fetch` in it, otherwise Coral can't resolve handles. Redis must support pub/sub, which Coral uses to pass the sign in back to the comment stream.

## Commenter Account Management Features

Optional features you can enable or disable to allows users to:

- change their usernames (once every 14 days)
- download their comments
- delete their account details.

## Session settings

Determines length of user sessions when not using SSO or when `exp` claim is not provided on JWT. Default: `90 Days`.

## Username Restrictions

Coral usernames are subject to the following validations:

- USERNAME_REGEX = `(/^[a-zA-Z0-9*.]+\$/)`
- USERNAME_MAX_LENGTH = `30`
- USERNAME_MIN_LENGTH = `3`

_NOTE: SSO users are not subject to username restrictions_
