---
title: Styling Talk with CSS
permalink: /integrating/styling-css/
---

You can add your own stylesheet in Admin > Configure > Tech Settings.

If you would like to change the styling of any elements in Talk, we provide global classnames with the prefix `talk-`. The easiest way to find the classname for the element you're looking for is to use the web inspector, and then update your stylesheet accordingly.

Plugins also have their own stylesheets located in the client directory.


Here is an example stylesheet that we use on our [Coral Blog](https://coralproject.net/blog):

```css
/*
 * You can use this stylesheet as a place to get started
 * for styling your own version of Talk!
 * Author: Sam Hankins, Coral Project, 2018
 * License: Apache 2.0 
 */

* {
  /* font-family: inherit; */
}

html, body {
  width:auto;
  height:auto;
}

body {
  font-family: Helvetica, 'Helvetica Neue', Verdana, sans-serif;
  width: 100%;
  font-size: 14px;
  margin: 0px;
  padding: 0px 0px 100px 0px;
  height: auto !important;
}

#talk-embed-stream-container {
  padding: 4px;
}

.expandForSignin {
  min-height: 600px;
}

.coralButton {
  margin: 5px 10px 5px 0px;
  background: none;
  padding: 0px;
  border: none;
  font-size: inherit;
}

.coralButton:hover {
  border-radius: 2px;
  color: #767676;
}

.coralButton i {
  margin-right: 3px;
}

.coralHr {
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.screen-reader-text {
   clip: rect(1px, 1px, 1px, 1px);
   height: 1px;
   width: 1px;
   overflow: hidden;
   position: absolute !important;
}

/* Notification styles */
#coral-notif {
  position: fixed;
  border: 0;
  background: rgb(105,105,105);
  color: white;
  border-radius: 2px;
  font-weight: bold;
}

/* Info Box Styles */


.talk-plugin-infobox-info {
  top: 0;
  border: 0;
  background: #DEEDFF;
  color: #2a2a2a;
  width: 100%;
  text-align: left;
  padding: 10px;
  margin-bottom: 10px;
  display: block;
  box-sizing: border-box;
  border-radius: 2px;
}

.talk-plugin-infobox-info em{
  font-style: italic;
}

.talk-plugin-infobox-info strong{
  font-weight: bold;
}

.talk-plugin-infobox-info blockquote{
  border-left: solid 2px #2a2a2a;
  padding-left: 10px;
}


.talk-plugin-infobox-info a{
  color: #2a2a2a;
}

/* Question Box Styles */

.talk-stream-comments-container {
  position: relative;
}

/* Comment styles */
.comment {
  margin-bottom: 10px;
  position: relative;
}

.talk-plugin-commentcontent-text {
  margin-bottom: 7px;
  font-size: 16px;
  font-weight: 100;
  line-height: 1.3;
}

/* Tag Labels */

.talk-plugin-tag-label {
  background-color: #4C1066;
  color: white;
  display: inline-block;
  border-radius: 2px;
  font-size: 12px;
  padding: 5px 6px;
}

/* Comment Action Styles */

.commentActionsRight, .replyActionsRight {
  display: flex;
  justify-content: flex-end;
}
.commentActionsLeft, .replyActionsLeft {
  display: flex;
  justify-content: flex-start;
  float: left;
}

button.comment__action-button,
.comment__action-button button {
  cursor: pointer;
}

button.comment__action-button[disabled],
.comment__action-button[disabled] button {
  cursor: inherit;
}

.comment__action-button--nowrap {
  white-space: nowrap;
}

.likedButton {
  color: rgb(0,134,227);
}

.flaggedIcon {
  color: #F00;
}

/* Flag Styles */

.talk-plugin-flags-popup-form {
  margin-bottom: 10px;
}

.talk-plugin-flags-popup-header {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 10px;
}

.talk-plugin-flags-popup-radio {
  margin:5px;
}

.talk-plugin-flags-popup-radio-label {
  margin:5px;
  font-weight: 400;
  font-size: .9rem;
}

.talk-plugin-flags-popup-counter {
  float: left;
  margin-top: 21px;
  color: #999;
}

.talk-plugin-flags-popup-button {
  float: right;
  margin-top: 10px;
}

.talk-plugin-flags-reason-text {
  margin-left: 20px;
  margin-top: 5px;
  width: 75%;
  font-size: 16px;
  border: 1px solid #ccc;
  max-width: calc(100% - 40px);
}

/* Close comments */

.close-comments-message {
  box-sizing: border-box;
  width: 100%;
  height: 100px;
}

.close-comments-confirm-wrapper {
  float: right;
}

.close-comments-alert {
  background-color: #d65344;
  color: white;
  font-size: 1.33rem;
  padding: 5px;
}

.close-comments-alert i.material-icons {
  font-size: 16px !important;
}

/* Load More */

.talk-load-more {
  text-align: center;
}

.talk-load-more button {
  width: 100%;
  text-align: center;
  color: #FFF;
  background-color: #2376D8;
  border-radius: 2px;
  cursor: pointer;
  padding: 10px;
  border-radius: 2px;
  line-height: 1em;
  text-transform: capitalize;
  display: inline-block;
}

.talk-load-more:hover button {
  background-color: #4399FF;
}

.talk-new-comments {
  width: 100%;
  text-align: center;
  margin: 4px 0;
}

.talk-load-more-replies {
  width: 100%;
  padding-left: 20px;
  box-sizing: border-box;
}

.talk-load-more-replies .talk-load-more-button {
  background-color: transparent;
  color: #979797;
  border: #979797 solid 1px;
  border-radius: 2px;
}

.talk-load-more-replies .talk-load-more:hover button {
  background-color: #979797;
  color: white;
}

.hidden  {
  visibility: hidden;
  display: none;
}
```
