---
title: Pre-Launch Checklist
permalink: /pre-launch-checklist/
---
- [ ] Where do you plan to host Talk?
  - On your own bare metal servers
  - In the cloud:
    - [AWS](/talk/planning-architecture)
    - [Google Cloud](/talk/planning-architecture/)
    - [Digital Ocean](/talk/planning-architecture/)


- [ ] Do you have a domain name for Talk?
  - **Recommended**: You should host Talk on a subdomain on your main site (e.g. if your site is mysitefornews.org, you should serve Talk from a subdomain like talk.mysitefornews.org) to avoid issues with third-party cookie sharing.

  
- [ ] Do you have a MongoDB instance?
  - A MongoDB [Docker instance](/talk/installation-from-docker/) hosted alongside Talk?
  - In an external MongoDB cluster?
    - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    - [mLab](https://mlab.com/)


- [ ] Do you need to migrate comments from a legacy system? We currently support Disqus, Livefyre, and Civil Comments.
  - Use the [Talk Import](https://github.com/coralproject/talk-importer) framework
  

- [ ] Do you want to provide single sign-on (SSO) by integrating with an external auth system?
  - See [Authenticating with Talk](/talk/integrating/authentication/)

- [ ] Do you want to integrate Talk with your CMS to automate embedding Talk Comment Stream into your site?
  - See [CMS Integration](/talk/integrating/cms-integration/)

- [ ] Do you want to use Social sign-on?
  - Facebook
    - Install [talk-plugin-facebook-auth](/talk/plugin/talk-plugin-facebook-auth/)
  - Google
    - Install [talk-plugin-google-auth](/talk/plugin/talk-plugin-google-auth/)
  - Other
    - See [Authenticating with Talk](/talk/integrating/authentication/)


- [ ] Do you want to use our Toxic Comments Plugin to help you automatically moderate comments based on their likelihood of being toxic?
  - [Request a free API Key from Google](https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md)
  - Install [talk-plugin-toxic-comments](/talk/plugin/talk-plugin-toxic-comments/)


- [ ] Do you want to automatically prevent spam using the Akismet Spam Detection Plugin?
  - [Request / pay for API Key from WordPress](https://akismet.com/)
  - Install [talk-plugin-akismet](/talk/plugin/talk-plugin-akismet/)


- [ ] Do you want to setup Email Notifications?
  - See [Notifications](/talk/integrating/notifications/)


- [ ] Do you want to setup rich text (bold, italics, quotes)?
  - Install [talk-plugin-rich-text](/talk/plugin/talk-plugin-rich-text)


- [ ] Do you want to display comment counts on your embed stream or on a homepage with dozens of articles?
  - Install [talk-plugin-comment-count](https://github.com/coralproject/talk-plugin-comment-count) for summary counts on multiple articles
  - Install [talk-plugin-deep-reply-count](/talk/plugin/talk-plugin-deep-reply-count) to add counts to the embed stream
  - Or use the GraphQL [CommentCountQuery](https://docs.coralproject.net/talk/api/graphql/#CommentCountQuery)


- [ ] Do you want to translate Talk to a different language?
  - See [Translations and i18n](/talk/integrating/translations-i18n)
  
  
- [ ] Do you want to send all new comments or all reported comments to a Slack channel?
  - See [our blog for more information](https://coralproject.net/blog/slacking-on/)
  
  
- [ ] Has your community team configured Talk to match your community strategy?
  - See [our tutorial for more information](https://docs.coralproject.net/talk/when-youve-installed-talk/)
 
 
