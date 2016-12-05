# Contribution Guide

We're very excited that you're interested in contributing to Talk! There is much to do. Before you begin, please review this document to get a sense of the practices and philosophies that hold this project together.


## Doing the Work

We are here to make it as seamless as possible to contribute to Talk. The following lists are meant to make it straightforward to perform the mechanics of working on the project so you can focus your energy toward writing and reviewing content.


### Code Reviews

One of the most valuable aspects of working in software. It is something that should challenge the reviewer and author alike. It is a way of focusing knowledge, experience and opinions for the benefit of the project and the participants.

Code reviews are a collaboration to make _the work_ as good as it can be. Code reviews are not a good venue for providing direct instruction to _the author._  Focus on positive, incremental improvements that can be made on the work at hand.

Please take your time when writing and reviewing code. Here are some fundamental questions to open up a reviewing headspace.

**Is the code clear, efficient and a pleasure to read?**

Somewhere at the intersection of good variable names, well laid out file structures, consistent formatting and appropriate comments lies beautiful code. Code is language spoken to at least two very distinct audiences, the computer that interprets it and the developer who encounters it. Both should be at the front of your mind when reviewing code.

Thinking like a computer, you could ask:

* Is the code using memory efficiently?
* Is data being moved around unnecessarily?
* Are multiple network requests being made where fewer would do?
* Is there excess processing happening in a synchronous flow that may disrupt user experience?
* Are there large libraries included for small gains?

Then, returning to your human roots... Is the code readable?

* Can I understand what is happening here (and maybe even why) by simply opening up the file, starting at the top and reading downward?
* Do comments convey clear, full thoughts in a narrative language that provides background for the code choices?
* Are the files separated logically such that each one contains a clear concept of code?


**Is the API documentation up to date? Are all client calls written against the docs?**

We use [swagger](https://github.com/coralproject/talk/blob/master/swagger.yaml) to track our API documentation.

* If APIs are created or updated, is the swagger.yml file up to date? There's nothing more frustrating than trying to develop against docs that are out of date or wrong. We need to be meticulous here as it's the little differences that can cause the most frustration and tricky bugs.
* If client code calls APIs, are they written against the swagger.yml file? Are all return codes handled?

**Is there sufficient test coverage?**

Our tests folder is set up to mirror the code folders: [https://github.com/coralproject/talk/tree/master/tests](https://github.com/coralproject/talk/tree/master/tests)

* Can you a sense of the logic behind the code by reading the tests?
* Can you see both what should happen and what should _never, ever_ be allowed to happen?
* Are there future cases that are guarded against via the creation of unit tests (aka, making sure things are typed, specifically checking for all values that will be used, etc...)?


### Forking, Branching and Merging

Talk follows the _master as tip_ repo structure. `master` is the bleeding edge. It should be _as stable as possible_ but may suffer instabilities, generally during times that fundamental architectural elements are added.

Releases are _tagged_ off the master branch.

Contributions to Talk follow this process. There are a lot of steps, but mechanically following these steps will standardize communication, help stop errors and let you focus on your contribution.

* At the outset of a piece of work, a branch or fork is made from master.
* The work is done in that fork.
* As soon as the work has taken shape, a PR is created for discussion. (If the PR is created for review before it's ready to merge, please make that clear in the description/title.)
* At least one other contributor to the project must review all code (see Code Reviews below.)
* If there are merge conflicts with master, merge master into the branch.
* Ensure that [circleci](https://circleci.com/) passes all tests for your branch.  (If you have forked and do not have circleci set up, you and the reviewer should independently ensure that all the of Continuous Integration steps pass before merging.)
* If merge conflicts exist with `master`, merge `master` into your branch and re-run CI before merging into master.
* Merge to master, but _you're not quite done yet!_
* Deploy master to staging (or have a core member do so.)
* Ensure that all your changes are working on staging.
* Have your reviewer verify the same.
* ... aaaand the work is delivered!


## Continuous Integration

We use circleci to run our ci: [https://circleci.com/gh/coralproject/talk](https://circleci.com/gh/coralproject/talk)

Our pipeline will _test_, _lint_, and _build_ all pushes to the repo.

Any branch not passing CI will not be merged into master.

If you're working in a fork, please run each of the steps locally before submitting a PR.


## Coding Style

### API Design

When building APIs, we follow these principles:

* Follow [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) principles for basic operations.
* Avoid routing yourself into a corner, for example, by putting a variable other than an object's id directly after an object.
* Put non-required, flexible variables into query params, required/identity based values in request params.
