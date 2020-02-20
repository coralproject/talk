# Contributor's Guide

Welcome! We are very excited that you are interested in contributing to Coral.

This document is a companion to help you approach contributing. If it does not
do so, please [let us know how we can improve it](https://github.com/coralproject/talk/issues)!

By contributing to this project you agree to the
[Code of Conduct](CODE_OF_CONDUCT.md).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [What should I Contribute?](#what-should-i-contribute)
- [Writing Code](#writing-code)
  - [When should I create an issue?](#when-should-i-create-an-issue)
  - [What should I include?](#what-should-i-include)
- [Localization](#localization)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What should I Contribute?

There are at least three ways to contribute to Coral:

- Writing Code
- Providing Translations

## Writing Code

Conversation surrounding contributions begins in
[issues](https://github.com/coralproject/talk/issues).

### When should I create an issue?

File an issue as soon as you have an idea of something you'd like to contribute.
We would love to hear what you're thinking and help refine the idea to make it
into the Coral ecosystem.

Please file issues if you would like to contribute to Coral.

### What should I include?

Coral has adopted an iterative, agile development philosophy. All contributions
that make it into the Coral repository should start with a user story in this
form:

> As a [type of Coral user] I'd like to [do something] so that I can [get some result/value].

This exercise does two things:

- allows us to ground our technical choices in a clear, simple product need.
- expresses that product need in a way that doesn't imply a specific technical
  solution allowing for debate as to the best way to solve the problem.

Please feel free to provide as much detail as possible when filing the issue but
please do keep the initial issue specific to one need and try to avoid including
technical or design solutions.

If you have a specific technical or design solution in mind, please submit it as
the first comment on the thread.

## Localization

We use the [fluent](http://projectfluent.org/) library and store our
translations in [FTL](http://projectfluent.org/fluent/guide/) files in
`src/locales/` and `src/core/server/locales/`.

Strings are added or removed from localization bundles in the translation files
as needed. Strings **MUST NOT** be _changed_ after they've been committed and
pushed to master. Changing a string requires creating a new ID with a new name
(preferably descriptive instead of incremented) and deletion of the obsolete ID.
It's often useful to add a comment above the string with info about how and
where the string is used.

Once a language has enough coverage, it should be added to
`src/core/common/helpers/i18n/locales.ts`.

The [Perspective API](https://github.com/conversationai/perspectiveapi/blob/master/2-api/methods.md#analyzecomment-request)
also supports comments in specific languages. When the language is supported in
Coral and supported by the Perspective API, the language should be added to the
language map in `src/core/server/services/comments/pipeline/phases/toxic.ts`.
