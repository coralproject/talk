---
title: talk-plugin-rich-text
permalink: /plugin/talk-plugin-rich-text/
layout: plugin
plugin:
    name: talk-plugin-rich-text
    provides:
        - Client
        - Server
---

Enables secure rich text support server-side.

## Installation

Add `"talk-plugin-rich-text"` to the `plugins.json` in your Talk installation.
This plugin provides a server and a client side implementation.

###### Note: Possible plugin conflict
The plugin `talk-plugin-comment-content` will prevent this plugin from rendering comments with rich text styling and is not needed if this plugin is enabled.

## Server implementation

### How does this work?

This plugin uses the `comment.metadata` field to store the `richTextBody`. By
adding `richTextBody` to the schema we can later on resolve it as part of the
comment. The original `comment.body` is never touched. Using the `metadata`
field allow us to build plugins that are not invasive to the core and also test
the capabilities of our plugin framework. We encourage you to see the files and
check how easy is to build plugins! If you have any feedback, please let us
know.

### Configuration

There is a `config.js` in the root folder. This file contains the recommended
settings.

#### `highlightLinks`

A `boolean` to highlight links.  Set it to `false` to turn it off.

#### `linkify`

Settings for highlighting links. These will only apply if `higlightLinks` is set to `true`.

#### `dompurify`

Rules to sanitize html input.  We use [DOMPurify](https://github.com/cure53/DOMPurify) to prevent web attacks and XSS. Here is the complete list of [settings](https://github.com/cure53/DOMPurify)

#### `jsdom`

In order to run html in the server we need [jsdom](https://github.com/jsdom/jsdom). Usually you wouldn’t need to modify this settings.

## Client implementation

### How does this work?

This plugin contains 2 important components:

- The Editor (`./components/Editor.js`)
- The Comment Content Renderer (`./components/CommentContent.js`)

The editor component utilizes the [contentEditable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content) and execCommand API.

If you check our `index.js` you will notice that we inject this editor in the
`commentBox` slot. We do this to replace the core comment box with this one.

Now, in order to render the new styled comments we need a comment renderer. For
this task we will have to replace our core comment renderer by using the
`commentContent` slot.

If you are not familiar with GraphQL `client/index.js` will look complicated,
but fear not! With those functions we specify what to expect from the server
schema, how to perform optimistic updates and how keep the client store updated
with the latest changes.

We encourage you to see the files and check how easy is to build plugins! If you
have any feedback, please let us know.
