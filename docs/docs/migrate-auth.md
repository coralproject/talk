# Migrating to v6: Auth strategies

Coral v6+ supports more authentication strategies than v4 out of the box with no plugins required. Read more about [social authentication strategies and OIDC (new)](https://docs.coralproject.net/auth)

## SSO in v6+

V6 supports a simpler SSO integration that does not require a plugin. You will still need to [generate a signed token](https://docs.coralproject.net/sso). Note that the fields are different:

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

[Read more about SSO configuration](https://docs.coralproject.net/sso)
