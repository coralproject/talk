---
title: Single Sign-On
---

In order to allow seamless connection to an existing authentication system,
Coral utilizes the industry standard [JWT Token](https://jwt.io/) to connect. To
learn more about how to create a JWT token, see [this introduction](https://jwt.io/introduction/).

1. Visit: `https://{ CORAL_DOMAIN_NAME }}/admin/configure/auth`
2. Scroll to the `Login with Single Sign On` section
3. Enable the Single Sign On Authentication Integration
4. Enable `Allow Registration`
5. Copy the string in the `Secret` box
6. Click Save

> **NOTE:** Replace the value of `{{ CORAL_DOMAIN_NAME }}` with the location of your running instance of Coral.

You will then have to generate a JWT with the following claims:

- `jti` _(optional)_ - A unique ID for this particular JWT token. We recommend
  using a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)
  for this value. This claim controls the logout functionality on the embed stream. To disable the “Sign Out” links in the embed, remove this claim, and disable “Login with email authentication” on the Comment Stream. You can then call `logout()` on the embed, or expire the token when the SSO user should be signed out of Coral.
- `exp` _(optional)_ - When the given SSO token should expire. This is
  specified as a unix time stamp in seconds. Once the token has expired, a new
  token should be generated and passed into Coral. Without this parameter you will need to call `logout()` on the embed itself.
- `iat` _(optional)_ - When the given SSO token was issued. This is required to
  utilize the automatic user detail update system. If this time is newer than
  the time we received the last update, the contents of the token will be used
  to update the user. Any claims not present on the jwt will be ignored on update, and will not overwrite existing values.
- `user.id` **(required)** - the unique ID of the user from your authentication system.
  This is required to connect the user in your system to allow a seamless
  connection to Coral.
- `user.email` **(required)** - the unique email address of the user from your
  authentication system. This is required to facilitate notification email's
  about status changes on a user account such as bans or suspensions.
- `user.username` **(required)** - the username that should be used when being
  presented inside Coral to moderators and other users. There are no username validations or restrictions enforced by Coral when you're using SSO.
- `user.badges` _(optional)_ - array of strings to be displayed as badges beside
  username inside Coral, visible to other users and moderators. For example, to indicate
  a user's subscription status. If you include the claim, but you are not passing a badge value, then use an empty array instead of null.
- `user.role` _(optional)_ - one of "COMMENTER", "STAFF", "MODERATOR", "ADMIN". Will create/update
  Coral user with this permission level. When users have both an assigned role greather than COMMENTER and a badge, both will be displayed.
- `user.url` _(optional)_ - url for user account management, where a user will
  be able to perform account management tasks such as changing password or
  deleting data. If provided, user will be able to access this URL by clicking
  on the "account" tab from the stream.

An example of the claims for this token would be:

```json
{
  "jti": "151c19fc-ad15-4f80-a49c-09f137789fbb",
  "exp": 1572172094,
  "iat": 1562172094,
  "user": {
    "id": "628bdc61-6616-4add-bfec-dd79156715d4",
    "email": "bob@example.com",
    "username": "bob"
  }
}
```

With the claims provided, you can sign them with the `Secret` obtained from the
Coral administration panel in the previous steps with a `HS256` algorithm. This
token can be provided in the above mentioned embed code by adding it to the
`createStreamEmbed` function:

```js
Coral.createStreamEmbed({
  // Don't forget to include the parameters from the
  // "Embed On Your Site" section.
  accessToken: "{{ SSO_TOKEN }}",
});
```

Or by calling the `login/logout` method on the embed object:

```js
var embed = Coral.createStreamEmbed({
  // Don't forget to include the parameters from the
  // "Embed On Your Site" section.
});

// Login the current embed with the generated SSO token.
embed.login("{{ SSO_TOKEN }}");

// Logout the user.
embed.logout();
```

## External Integrations

You can integrate directly with the Coral GraphQL API in order to facilitate
account updates for your users when using Coral SSO. The relevant mutations are
as follows:

- `updateUserUsername` lets you update a given user with a new username using
  an admin token.
- `updateUserEmail` lets you update a given user with a new email address
  using an admin token.
- `deleteUser` lets you delete a given account using an admin token.
  Note that even with an admin token, you may not delete yourself via
  this method, and instead must use the `requestAccountDeletion`
  mutation instead. This differs from the `requestAccountDeletion` as
  it does the operation immediately instead of scheduling it as
  `requestAccountDeletion` does.
- `requestUserCommentsDownload` lets you retrieve a given account's comments download. This mutation will provide you with a `archiveURL` that can be used to download a ZIP file containing the user's comment export.

If you're unsure on how to call GraphQL API's, refer to the section here on [Making your first GraphQL request](/api/schema#making-your-first-request).

## Login Prompts

In order to handle login prompts (e.g. a user clicks on the sign in button) you can listen to the `loginPrompt` event.

```js
var embed = Coral.createStreamEmbed({
  // Don't forget to include the parameters from the
  // "Embed On Your Site" section.
  events: function (events) {
    events.on("loginPrompt", function () {
      // Redirect user to a login page.
      location.href = "http://example.com/login";
    });
  },
});
```

## Troubleshooting JWT Validation Errors

In addition to the uniqueness constraints on User `id` and `email` values, each `user.id`/`user.email` combination must also be unique inside Coral. This is true for both Single Sign On users created by JWT tokens, as well as users that register/login using Coral’s built in “Login with email authentication”. You cannot share authentication strategies for a single user; thus, if a user logs in with SSO, they cannot also login with email and vice versa. When you attempt to authenticate a JWT token with an email address that already exists in Coral with a different `user.id` than was passed on the token Coral will throw a Duplicate User error.

Any JWT validation errors thrown can be found in Coral's server logs.
