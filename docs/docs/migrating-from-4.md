---
title: Migrating from Talk v4.x to Coral v7+
---

When we started building Talk, the precursor to our Coral platform, we wanted it to be as flexible as possible, so we could learn what publishers needed, and allow companies to customize almost every aspect of the experience.

We learned two key things:

1. More than 90% of publishers used the same plugin setup
2. A handful of publishers created plugins that made the platform more challenging to use, and would have required significant re-architecture of the Coral platform to support properly

Taking everything we learned, in 2019 we relaunched with a complete rewrite of the platform, calling the new version Coral. The new version no longer has custom plugins.

We added a new application model structure using Typescript, switched out the plugins for core configurations, built in SSO support via JWTs, and hugely improved our APIs.

Talk, (v4.x.x) , is no longer supported. Since 2019, we have almost exclusively been developing features for Coral (currently v7.x.x).

In order to upgrade to the latest version, you need to [create a new instance](https://docs.coralproject.net/) of the latest Coral version, then migrate your data from the previous version into the new instance.

This guide will give you instructions on how to do the migration.

## Steps to migrate from Talk (v4.x) to Coral (v7.x+)

**Note: if you plan on importing data from v4.x, complete all import steps _first_ before you create any data (stories, users, comments) in your v6 instance to avoid conflicts.**

1. [Set up a new instance of Coral based off the latest docker image](/)
2. [Configure or reconfigure authentication strategies](/migrate-auth)
3. [Find alternatives for any functionality introduced in custom plugins](/migrate-custom)
4. [Update embed code, including any custom event tracking](/cms)
5. [Update custom CSS](/css)
6. [Export historical Talk(v4) data and translate for import to Coral(v7) with Importer Tools](/migrate-data)
