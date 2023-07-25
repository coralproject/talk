---
title: FAQ
---

## How can I get help, submit a bug, or suggest a feature?

There are a few avenues to get in touch with us and others in the community for help.

To log a bug or request a feature, submit a Support ticket ([support@coralproject.net](mailto:support@coralproject.net)) and someone from our team will get back to you.

You can also request help on GitHub by [submitting an issue](https://github.com/coralproject/talk/issues). This also increases your chances of having someone from the community respond to help.

## How can our dev team contribute to Coral?

We are lucky to work with newsroom dev teams and individual contributors who span the world, and come from newsrooms of all sizes. You can read our [Contribution Guide](https://github.com/coralproject/talk/blob/master/CONTRIBUTING.md) to get started, but feel free to reach out to us via GitHub too.

## What if we want to add a feature you don't have?

Coral is open source, so you're free to develop additional functionality and [submit a pull request](https://github.com/coralproject.net/talk).

## Do you have GDPR features?

Yes! Please read our [GDPR documentation](/gdpr) for your version for more information and instructions to get started.

## Can I import my existing comments?

Yes! For version 4.x.x we have a community-supported [import framework](https://github.com/coralproject/talk-importer) that you can use to migrate your existing comments.

Import tools are still in development for version 5, but will be coming soon! Contact us at [support@coralproject.net](mailto:support@coralproject.net) if you need an importer for version 5.x.x.

## Does Coral enforce unique usernames?

We don't do this because your [SSO](https://docs.coralproject.net/sso) should be the single source of truth for all user account management, including usernames. If Coral were to reject or change usernames supplied by the SSO, there would be a conflict, as we only receive from your SSO and don't push changes to your user database. 

## What support is available?

You can always email us at [support@coralproject.net](mailto:support@coralproject.net), and if we are able to help we will answer your questions. In some cases, we are able to offer paid support packages. You can inquire about this via the support email address above.

## Is there a hosted version I can purchase by monthly subscription?

Yes! [Visit our hosting page](https://coralproject.net/pricing/) to submit information and receive a quote.

## Where is our data when we use Coral?

If you are hosting Coral on your own:

- Your data is stored in a MongoDB database that you provide
- The Coral team doesn’t have any access to your data

If you are using our Hosted SaaS version of Coral:

- Your data is stored in a MongoDB cluster that is provisioned for your instance
- Your data is logically isolated from other customers' data
- The Coral Team and its third-party database hosting providers use strict access controls and auditing to protected your data from unauthorized access

## Does Coral have any automated moderation features to protect against spam and trolling?

As well as basic word/phrase filtering and user recent history scores, Coral offers optional advanced features via third-party services:

- The [Toxic Comments filter](/administration#toxic-comment-filter) integrates with the [Perspective API from Google](https://www.perspectiveapi.com/) to detect the likelihood of toxicity of comments in real-time
- The [Akismet Spam filter](/administration#spam-detection-filter) detects and blocks spam comments

## How much can I customize Coral?

The CSS of the embedded comment stream can be customized by adding your own CSS via an external stylesheet. See [CSS](/css) for instructions.

## How much does Coral cost?

- The Coral software is freely available under the Apache 2.0 open source license
- Associated costs are those for the infrastructure required to run Coral (i.e. cloud hosting fee or bare-metal server costs)
- The Coral Project offers a SaaS/hosted version of Coral. Please [get in touch with us](https://coralproject.net/pricing/) to discuss pricing for your requirements.
