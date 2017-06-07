---
title: Setup
sidebar: talk_sidebar
permalink: install-setup.html
summary:
---

Once you've installed Talk (either via Docker or source), you still need to
setup the application. If you are unfamiliar with any terminology used in the
setup process, refer to the `TERMINOLOGY.md` document.

## Via Web

If you want to perform your setup via the web, you can navigate to your
installation of Talk at the path `/admin/install`. There you will be asked a
series of questions for your installation.

## Via CLI

If you want to perform your setup through the terminal, you can simply run:

```bash
cli setup
```

And follow the instructions to perform initial setup and create your first user
account.


# Usage

After setup is complete, you can then refer to the `/admin/configure` path to
get the embed code that you can copy/paste onto your blog or website in order to
start using Talk.

_In order for the embed to work correctly, you will need to whitelist the domain
that is allowed to embed your site on the `/admin/configure` page, failure to do
so will result in the comment stream not loading._
