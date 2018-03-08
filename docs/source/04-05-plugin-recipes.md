---
title: Plugin Recipes
permalink: /plugin-recipes/
class: configuration
toc: true
---

Plugin Recipes are plugin templates used to help bootstrap the development of a
plugin. Recipes are available at the
[coralproject/talk-recipes](https://github.com/coralproject/talk-recipes) repo.
When first developing a plugin with a recipe, you can simply visit the
aforementioned repository to find the desired recipe, and using the file
listings on the page, determine which files need to be modified to suit your
needs.

The following are the available recipes for use:

## recipe-avatar

Source: [talk-recipes/tree/master/plugins/avatar](https://github.com/coralproject/talk-recipes/tree/master/plugins/avatar)

Provides support for avatars hosted via third party, extends the User Model and
provides UI on the client-side too.


## recipe-translations

Source: [talk-recipes/tree/master/plugins/translations](https://github.com/coralproject/talk-recipes/tree/master/plugins/translations)

Provides an example for overriding application text through the translation
system.


## recipe-subscriber

Source: [talk-recipes/tree/master/plugins/subscriber](https://github.com/coralproject/talk-recipes/tree/master/plugins/subscriber)

Provides an example for adding `SUBSCRIBER` badges for users with the
`SUBSCRIBER` tag added to their user model through a direct server plugin with
the auth system.


## recipe-author-name

Source: [talk-recipes/tree/master/plugins/author-name](https://github.com/coralproject/talk-recipes/tree/master/plugins/author-name)

Enables the ability to hover over a commenter’s name and add plugin
functionality there. The Member Since plugin that is provided in this recipe is
an example of this.
