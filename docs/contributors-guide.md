---
title: Contributor's Guide
keywords: homepage
sidebar: talk_sidebar
permalink: contribute.html
summary:
---


Welcome! This guide is meant 

## What should I Contribute?

There are three main ways to contribute to Talk:

* Writing Code
* Writing Docs
* Participating in conversation
* Translating

## Contributing Code

The first question to ask is where your contribution fits into Talk's plugin / core architecture. 

Talk core consists of architecture and functionality that deliver stability, security, scalability, extendability and other *abilities. In addition, the Core contains features and functionality that is essential to the operation of Talk as a product.

Talk plugins deliver the featuers and functionality that can be changed or removed. Much of the default functionality is delivered by plugins allowing developers to change behavior along product lines that we've found to be important.

Our goal is to continually extend our plugin infrastructure making the Core as pluggable as possible. Ultimately, a day may come where the Core of Talk is simply a framework for delivering a certain flavor of web applications.

### Should I contribute via a Plugin or to the Core?

Ask these questions:

1) Does Talk's exiting Plugin APIs support the thing you want to build? 

If so, then you should build it as a plugin. Feel free to explore here on your own or reach out to us. We love to advise on plugins, so please feel free to _specify your contribution_ as described below to start a conversation. We will help you conceptualize, architect and promote your plugin if it is in line with our values.

2) If the current Plugin API doesn't support your idea, should the API be extended to do so?

As mentioned above, we seek to interatively extend the Talk Plugin API. How do we know what the next iteration will be? Your ideas. If you want to build a plugin that isn't supported, please _specify your contribution_ as described below and we will discuss how the Core may be extended to support not only your specific idea, but other's ideas as well.

Quite often the only things missing from Core are things like _events_, _slots_, _CSS classes_, etc... Adding these is a great way to become a Core Contibutor and break new ground as a Plugin Developer.

3) Is my idea really just Core?

Amazing! We are always looking to extend the capabilities of Talk. We look forward to discussing what you've got to bring!


### Specify your Contribution

Coral has adopted an iterative, agile development philosophy. All contributions that make it into the Talk repo should start with a story or this form:

`As a [type of person] I'd like to be able to [do something] so that I can [get some result].`

We have found that the exercise of expressing our next steps in this format allows us to ground our technical choices in a clear, simple product need. It also expresses that product need in a way that doesn't imply a specific technical solution allowing for debate as to the best way to solve the problem.


## Contributing Documentation

Clear docs are a prerequisite for a successful open source project. Contributing to the documentation is often more important than contributing to the code!

We are looking for _documentarians_ to:

* make clarity, grammar and completeness updates,
* create new / missing sections, and
* take the lead in making sections, or the over all structure better.

Information about how to update docs can be found in our [FAQ](faq.html#how-do-i-contribute-to-these-docs).

If you'd like to make a significant contribution, please [file an issue](https://github.com/coralproject/talk/issues) describing the changes you would like to make and we'll begin the conversation. 

## Contributing Translations

Talk's tranlations are stored in `.yml` files [here](https://github.com/coralproject/talk/tree/master/locales). 

Translations can be submitted via pull request. localIf you do not use github, you can use 'en.yml' as a template and email the translations to us and we can import it into the repo.  

## I want to contribute but I'm not sure what to do!

If you want to contribute but don't have a clear idea of exactly what that may be, here are some resources that may help:

### Product Roadmap

Please visit our product roadmap here: https://www.pivotaltracker.com/n/projects/1863625. If you'd like to take on any of our scheduled tasks we'd be forever grateful!

### Discussion Forum

If you'd like to discuss what we're up to, please visit or [community](https://community.coralproject.net/) or [contact us](https://coralproject.net/contact.html).

### Integrations

Have a favorite analytics engine? Data science service? CMS? Auth platform? Deployment platform or pipeline? Pet project? Consider building a plugin to integrate them!

### Favorite Features?

Do you have a favorite feature of an exisitng platform that's not yet been done in Talk? Sounds like Talk needs that feature.

## Thanks!

By contributing to this project you agree to the [Code of Conduct](https://coralproject.net/code-of-conduct.html).


