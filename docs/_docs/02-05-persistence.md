---
title: User Persistence
permalink: /docs/running/persistence/
---

One of the biggest problems on the internet today is the proliferation of
sophisticated tracking systems and the outcome of invading user's privacy. This
has had quite a big impact on our design of Talk, as we've had to work around
the safeguards that are there to keep your data safe while still allowing our
application to run smoothly on the page it's embedded on.

---

**Problem**: Safari has inconsistent behavior around localStorage when used
within an iFrame.

**Solution**: We set a cookie instead when Safari is detected to store the auth
state.

---

**Problem**: Safari's default privacy settings block cookies from domains that
do not match the current domain.

**Solution**: When using Talk's built in auth, we will open a pop-out when
setting the cookie, so that the domain of the setting domain matches the issuer.

---

**Problem**: When using a different domain for websockets, and using the built
in auth solution, cookies are not set on that domain for use with Safari.

**No Solution Exists**: It is our expectation that for users that must deploy
Talk in environments that must run the websockets out of a separate domain will
use and integrate their own auth solution. During the login process in Talk,
users submit their user credentials to an auth endpoint, and receive a token
back, or for Safari, a cookie. Aggressive defaults in Safari make it not
possible to have one domain set cookies for another domain during this process.
This results in a situation where we have no way to persist the auth credentials
for this specific situation for the time being.

---

It's important to understand that these problems are in fact there to improve
privacy for end users.