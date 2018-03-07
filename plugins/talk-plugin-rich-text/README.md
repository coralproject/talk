# Talk Plugin Rich Text 
Enables secure rich text support server-side.


## Installation
Add `talk-plugin-rich-text` to the `plugins.json` in your Talk installation. Remember to add this in the `server` property since this plugin only covers the server side. To add frontend support consider using `talk-plugin-rich-text-pell`.

## How does this work?
This plugin uses the `comment.metadata` field to store the `richTextBody`. By adding `richTextBody` to the schema we can later on resolve it as part of the comment. The original `comment.body` is never touched. Using the `metadata` field allow us to build plugins that are not invasive to the core and also test the capabilities of our plugin framework. We encourage you to see the files and check how easy is to build plugins! If you have any feedback, please let us know.

## Configuration
There is a `config.js` in the root folder. This file contains the recommended settings. 

### `highlightLinks`
A `boolean` to highlight links.  Set it to `false` to turn it off.

### `linkify`
Settings for highlighting links. These will only apply if `higlightLinks` is set to `true`.

### `dompurify`
Rules to sanitize html input.  We use [DOMPurify] (https://github.com/cure53/DOMPurify) to prevent web attacks and XSS. Here is the complete list of [settings] (https://github.com/cure53/DOMPurify)

## `jsdom`
In order to run html in the server we need [jsdom](https://github.com/jsdom/jsdom). Usually you wouldn’t need to modify this settings. 
