---
title: Plugins
permalink: /docs/running/plugins/
---

Configuration for the available plugins are stored in a JSON encoded string. The format
of this document are available with the [Plugins Overview]({{ "/docs/plugins/" | absolute_url }}).

You can override the plugin config by specifying the content in the `TALK_PLUGIN_JSON`
environment variable.

## Bundled Plugin Configuration
{:.no_toc}

Some of the core plugins that are bundled with Talk require specific configuration to be
available.

{% include toc %} 

### Facebook Authentication

- `TALK_FACEBOOK_APP_ID` (*required*) - the Facebook app id for your Facebook
Login enabled app.
- `TALK_FACEBOOK_APP_SECRET` (*required*) - the Facebook app secret for your
Facebook Login enabled app.