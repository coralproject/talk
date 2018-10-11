# Pre-Launch Checklist

- [ ] Where do you plan to host Talk?
  - On your own bare metal servers
  - In the cloud:
    - [AWS](01-04-planning-architecture)
    - [Google Cloud](01-04-planning-architecture)
    - [Digital Ocean](01-04-planning-architecture)


- [ ] Do you have a domain name for Talk?
  - **Recommended**: You should host Talk on a subdomain on your main site (e.g. if your site is mysitefornews.org, you should serve Talk from a subdomain like talk.mysitefornews.org) to avoid issues with third-party cookie sharing.

  
- [ ] Do you have a MongoDB instance?
  - A MongoDB [Docker instance](./01-01-talk-quickstart.html#installation-from-docker) hosted alongside Talk?
  - In an external MongoDB cluster?
    - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    - [mLab](https://mlab.com/)


- [ ] Do you need to migrate comments from a legacy system? We currently support Disqus, Livefyre, and Civil Comments.
  - Use the [Talk Import](https://github.com/coralproject/talk-importer) framework


- [ ] Do you want to provide single sign-on (SSO) by integrating with an external auth system?
  - See [Authenticating with Talk](./integrating/authentication.html)


- [ ] Do you want to use Social sign-on?
  - Facebook
    - Install [talk-plugin-facebook-auth](plugin/talk-plugin-facebook-auth.html)
  - Google
    - Install [talk-plugin-google-auth](plugin/talk-plugin-google-auth.html)
  - Other
    - See [Authenticating with Talk](./integrating/authentication.html)


- [ ] Do you want to use our Toxic Comments Plugin to help you automatically moderate comments based on their likelihood of being toxic?
  - [Request a free API Key from Google](https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md)
  - Install [talk-plugin-toxic-comments](plugin/talk-plugin-toxic-comments.html)


- [ ] Do you want to automatically prevent spam using the Akismet Spam Detection Plugin?
  - [Request / pay for API Key from WordPress](https://akismet.com/)
  - Install [talk-plugin-akismet](plugin/talk-plugin-akismet.html)


- [ ] Do you want to setup Email Notifications?
  - See [Notifications](./integrating/notifications.html)


- [ ] Do you want to setup rich text (bold, italics, quotes)?
  - Install [talk-plugin-rich-text](plugin/talk-plugin-rich-text.html)


- [ ] Do you want to display comment counts?
  - Use the GraphQL [CommentCountQuery](https://docs.coralproject.net/talk/api/graphql/#CommentCountQuery)
  - Install [talk-plugin-deep-reply-count](plugin/talk-plugin-deep-reply-count.html) if necessary.


- [ ] Do you want to translate Talk to a different language?
  - See [Translations and i18n](integrating/translations-i18n.html)
  
  
- [ ] Do you want to send all new comments or all reported comments to a Slack channel?
  - See [our blog for more information](https://coralproject.net/blog/slacking-on/)
  
  
- [ ] Has your community team configured Talk to match your community strategy?
  - See [our tutorial for more information](https://docs.coralproject.net/talk/when-youve-installed-talk/)
 
 
