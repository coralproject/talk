---
title: Plugins Overview
permalink: /plugins/
---

There are several ways to install plugins.

### Default Plugins vs. Custom Plugins

Talk ships with a default set of plugins, available in `plugins.default.json`. When you run Talk with just the default plugins, these are the plugins that will be enabled.

If you want to use the additional plugins that are available, you can create a `plugins.json` file. If this file exists, Talk will use that to determine which plugins to use.

### Installing a Plugin from npm


If you create your own plugin, you can publish the plugin to npm and use it in Talk. The npm package can be public (open source) or private.

You would include this in your `plugins.json`:

EXAMPLE HERE

### Installing a Local Plugin

If you host your own plugin on Github, you can enable it by adding this to your `plugins.json`:

EXAMPLE HERE

### Best Practice



