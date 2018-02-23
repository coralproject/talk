# Talk Plugin Rich Text - Pell
Enables rich text support client-side by using [Pell](https://github.com/jaredreich/pell).

## Installation
Add `talk-plugin-rich-text-pell` to the `plugins.json` in your Talk installation. Remember to add this in the `client` property since this plugin only covers the client side. To add server support, please use `talk-plugin-rich-text`. Ensure that you don't have any other plugins utilizing the `commentContent` slot, as it would result in duplicate comments.

## How does this work?
This plugin contains 2 important components:
  - The Editor (`./components/Editor.js`)
  - The Comment Content Renderer (`./components/CommentContent.js`)

The editor component contains the rich text editor. For this particular plugin we chose [Pell](https://github.com/jaredreich/pell). Pell is the simplest and smallest WYSIWYG text editor with no dependencies that we could find.

If you check our `index.js` you will notice that we inject this editor in the `commentBox` slot. We do this to replace the core comment box with this one. 

Now, in order to render the new styled comments we need a comment renderer. For this task we will have to replace our core comment renderer by using the `commentContent` slot.

If you are not familiar with GraphQL `client/index.js` will look complicated, but fear not! With those functions we specify what to expect from the server schema, how to perform optimistic updates and how keep the client store updated with the latest changes. 

We encourage you to see the files and check how easy is to build plugins! If you have any feedback, please let us know. 
