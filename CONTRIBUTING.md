# Contributor's Guide

Welcome! We are very excited that you are interested in contributing to Talk.

This document is a companion to help you approach contributing. If it does not do so, please [let us know how we can improve it](https://github.com/coralproject/talk/issues)!

By contributing to this project you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## What should I Contribute?

There are at least three ways to contribute to Talk:

* Writing Code
* Writing Docs
* Providing Translations

## Writing Code

Conversation surrounding contributions begins in [issues](https://github.com/coralproject/talk/issues).

### When should I create an issue?

File an issue as soon as you have an idea of something you'd like to contribute. We would love to hear what you're thinking and help refine the idea to make it into the Talk ecosystem.

Please file issues if:

* you would like to contribute to Talk Core.
* you are building a Plugin that the current Plugin API doesn't support.
* you are building a Plugin and want advice.

### What should I include?

Coral has adopted an iterative, agile development philosophy. All contributions that make it into the Talk repository should start with a user story in this form:

> As a [type of Coral user] I'd like to [do something] so that I can [get some result/value].

This exercise does two things:

* allows us to ground our technical choices in a clear, simple product need.
* expresses that product need in a way that doesn't imply a specific technical solution allowing for debate as to the best way to solve the problem.

Please feel free to provide as much detail as possible when filing the issue but please do keep the initial issue specific to one need and try to avoid including technical or design solutions.

If you have a specific technical or design solution in mind, please submit it as the first comment on the thread.

## Contributing Documentation

Clear docs are a prerequisite for a successful open source project. Contributing to the documentation is often more important than contributing to the code!

We are looking for _documentarians_ to:

* make clarity, grammar and completeness updates,
* create new / missing sections, and
* take the lead in making sections, or the over all structure better.

Our documentation is stored in markdown files in the [docs](docs) directory. We
use [Hexo](https://hexo.io/) to provide our docs. To preview:

```shell
cd docs
yarn
yarn start
```

Then visit http://127.0.0.1:4000/talk/.

If you'd like to discuss a contribution, please [file an issue](https://github.com/coralproject/talk/issues) describing the changes you would like to see.

## Contributing Translations

Talk's translations are stored in `.yml` files [here](https://github.com/coralproject/talk/tree/master/locales).

Translations can be submitted via pull request. If you do not use github, you can use 'en.yml' as a template and [email](https://coralproject.net/contact) the translations to us. We can import it into the repository.
