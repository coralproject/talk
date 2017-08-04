---
title: Secrets
permalink: /docs/running/secrets/
---

{% include toc %}

## Secret Types

We support two types of secrets.

- Shared secrets
- Asymmetric Secrets

### Shared Secret

You would use a shared secret when you have no need to share the tokens with
other applications in your organization.

Supported signing algorithms:

- HS256
- HS384
- HS512

These must be provided in the form:

```json
{
  "secret": "<my secret key>"
}
```

### Asymmetric Secret

You would use a asymmetric secret when you want to share the token in your
organization, and would like to pass an existing auth token to Talk in order to
authenticate your users. (Documentation on how to do this is pending!).

Supported signing algorithms:

- RS256
- RS384
- RS512
- ES256
- ES384
- ES512

These must be provided in the form:

```json
{
  "public": "<the PEM encoded public key>",
  "private": "<the PEM encoded private key>"
}
```

Note that when using the asymmetric keys as discussed above, the certificates
must have their newlines replaced with `\\n`, this is to ensure that the
newlines are preserved after JSON decoding. Not doing so will result in parsing
errors.

To assist with this process, we have developed a tool that can generate new
certificates that match our required format: [coralcert](https://github.com/coralproject/coralcert).
This tool can generate RSA and ECDSA certificates, check it's [README](https://github.com/coralproject/coralcert)
for more details.

## Authentication Types

Talk also supports two methods of providing authenticationd details.

- Single key: this is used when your secrets do not need to be rotated.
- Multiple keys: this is used when you expect to rotate your secrets.

### Single Key

When using a single key, you can utilize the following configuration style:

- `TALK_JWT_SECRET` (*required*) - The shared secret or certificate (depending
  on your choice of `TALK_JWT_ALG`) used for jwt tokens.

An example of this:

```bash
# for a shared secret
TALK_JWT_SECRET={"secret": "<my secret string>"}

# for a asymmetric secret
TALK_JWT_SECRET={"private": "<my private key>", "public": "<my public key>"}
```

### Multiple Key

When using a multiple keys, you can utilize the following configuration style:

- `TALK_JWT_SECRETS` (_optional_) - used when specifying multiple secrets used
  for key rotations. This is a JSON encoded array, where each element matches
  the JWT Secret pattern.

All secrets also get a `kid` field which uniquely identifies a given key and
will sign all tokens with that `kid` for later identification.

An example of this:

```bash
# for a shared secret
TALK_JWT_SECRETS=[{"kid" "1", "secret": "<my secret string>"}, {"kid" "2", "secret": "<my other secret string>"}]

# for a asymmetric secret
TALK_JWT_SECRETS=[{"kid": "1", "private": "<my private key>", "public": "<my public key>"}, {"kid": "2", "private": "<my other private key>", "public": "<my other public key>"}]
```