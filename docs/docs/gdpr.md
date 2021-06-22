---
title: GDPR Compliance
---

In order to facilitate compliance with the
[EU General Data Protection Regulation (GDPR)](https://www.eugdpr.org/), Coral
provides features so your users can change and manage their own data.

Even if GDPR will not apply to you, it is recommended to enable these
features as a best practice to provide your users with control over their own
data.

## GDPR Feature Overview

Integrating our GDPR tools will give your users and organizations the following benefits:

- **Download my comment data**: Users can request a download of their comments. An email with a link is emailed to them to download a CSV with each comment they've made, what story it was made on, and the comment's ID and timestamp.
- **Delete my account**: Users can request deletion of their account. Deleted account requests are pending for 24 hours to allow the user to download their comments, or to change their mind and reactivate their account before the expiry. Account deletions remove all of their comments from the site, all their comments and actions from the database, and their account info from our system.
- **Add an email to an OAuth/external account**: Users are prompted to add an email to their non-Coral account (Facebook, Google, external, etc) so that they can take part in GDPR and other features requiring email communication.
- **Change my username**: Users can update their username. This is capped at once every 2 weeks.
- **Change my email**: Users can change their email.
- **Change my password**: Users can change their password.

## GDPR with SSO

As many newsrooms often implement their own [SSO solutions](/sso),
we also provide API support to manage GDPR features directly from your own Account or My Profile page.

We provide the following GraphQL mutations designed to allow you to integrate it into your existing user
interfaces or exports.

- `requestUserCommentsDownload` - lets you grab the direct link to download a users
  account in a zip format. From there, you can integrate it into your existing
  data export or simply proxy it to the user to allow them to download it
  elsewhere in your UI.
- `deleteUserAccount` - lets you delete the specified user

**Note: These mutations require an administrative token**
