---
title: Pre-Launch Checklist
permalink: /pre-launch-checklist/
---
- [ ] Where do you plan to host Talk?
  - On your own bare metal servers
  - In the cloud:
    - [AWS](/talk/planning-architecture)
    - [Google Cloud](/talk/planning-architecture/)
    - Heroku
    - [Digital Ocean](/talk/planning-architecture/)


- [ ] Do you have a domain name for Talk?
  - **Recommended**: You should host Talk on a subdomain on your main site (e.g. if your site is mysitefornews.org, you should server Talk from a subdomain like talk.mysitefornews.org) to avoid issues with third-party cookie sharing.

  
- [ ] Do you have a MongoDB instance?
  - A MongoDB [Docker instance](/talk/installation-from-docker/) hosted alongside Talk?
  - In an external MongoDB cluster?
    - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    - [mLab](https://mlab.com/)


- [ ] Do you need to migrate comments from a legacy system? We currently support Disqus, Livefyre, and Civil Comments.
  - Use the [Talk Import](https://github.com/coralproject/talk-importer) framework


- [ ] Do you want to provide single sign-on (SSO) by integrating with an external auth system?
  - See [Authenticating with Talk](/talk/integrating/authentication/)


- [ ] Do you want to use Social sign-on?
  - Facebook
    - Install [talk-plugin-facebook-auth](/talk/plugin/talk-plugin-facebook-auth/)
  - Goole
    - Install [talk-plugin-google-auth](/talk/plugin/talk-plugin-google-auth/)
  - Other
    - See [Authenticating with Talk](/talk/integrating/authentication/)


- [ ] Do you want to use our Toxic Comments Plugin to help you automatically moderate comments based on their likelihood of being toxic?
  - [Request API Key from Google](https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md)
  - Install [talk-plugin-toxic-comments](/talk/plugin/talk-plugin-toxic-comments/)


- [ ] Do you want to automatically prevent spam using the Akismet Spam Detection Plugin?
  - Install [talk-plugin-akismet](/talk/plugin/talk-plugin-akismet/)


- [ ] Do you want to setup Email Notifications?
  - See [Notifications](/talk/integrating/notifications/)


- [ ] Do you want to display comment counts?
  - Use the GraphQL [CommentCountQuery](https://docs.coralproject.net/talk/api/graphql/#CommentCountQuery)
  - Install [talk-plugin-deep-reply-count](/talk/plugin/talk-plugin-deep-reply-count) if necessary.


- [ ] Do you want to translate Talk to a different language?
  - See [Translations and i18n](/talk/integrating/translations-i18n)
