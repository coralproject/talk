---
title: "Migrating from Talk v4.x to Coral v7+: Auth strategies"
---

Coral v7+ supports more authentication strategies than v4 out of the box with no plugins required. Read more about [social authentication strategies and OIDC (new)](/auth)

## SSO in v7+

In Legacy Coral, SSO authentication required:

1. a service to generate JWTs
2. a custom plugin to create and authenticate talk users from the JWTs

In Coral v7+, user creation and authentication is handled by Coral, to authenticate, you need to generate a JWT that matches the Coral format, sign it with the secret provided by Coral, and pass that JWT to Coral in the embed code.

Find out how to [generate a signed token](/sso). Note that the fields are different:

- `jti`: now optional
- `exp`: now optional
- `iat`: **new** when the token was issued
- `sub`: **deprecated** replaced by `user.id`
- `user.email`: **new, required**
- `user.username`: **new required**
- `user.id`: **new required** replaces `sub`
- `user.badges`: **new** optional
- `user.role`: **new** optional
- `user.url`: **new** optional
- `iss`: **deprecated**
- `aud`: **deprecated**

[Read more about SSO configuration](/sso)
