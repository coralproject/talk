# 2. Use Relay over Apollo in Front-End

Date: 2018-06

## Status

Accepted

## Context and Problem Statement

In v4 we started using Apollo due to its appealing promises that it has better docs, is easier to begin, and does not enforce strict patterns like Relay does. Apollo was first used in a naive way where each component that requires data would execute it's own query resulting in a large number of queries and round trips which performed badly.

We then transitioned to use Fat Queries that utilize fragments to compose a big query whose data response would then be distributed manually to the components that needed the data (Colocation).

Huge effort and complexity needed to be introduced to support this, as Apollo provided limited to no support for this use case. The lack of documentation of our home grown graphql framework is hindering quality contributions from the community.

It also revealed large performance issues inside Apollo that required an elaborate fork to fix.

Apollo is moving in a different direction, preventing us from upgrading apollo itself.

It is very easy to deteriorate performance, introduce bugs and break maintainability due to lack of proper Colocation support and prevention of misuse from the framework.

We reached out to the Apollo team but haven't received the required attention to fix the issues upstream.

For v5 we needed a better solution.


## Decision Drivers

A framework that:

- has first class support for Colocation
- is performant
- encourages best practices
- prevent bugs
- proven to work in a large and complex application
- easy to maintain
- good documentation

## Considered Options

* Relay

## Decision Outcome

At that time the only viable alternative to Apollo is Relay. In fact all the solutions we came up to make up for the missing Colocation support in Apollo looked a lot like Relay Classic anyway. A huge advantage was that Relay Modern was just released that has large improvments over Relay Classic and removed more Facebook related internals.

### Positive Consequences

* First class Colocation support means we were able to simplify our graphql framework to a handful of lines mostly related to typing and wrapping.
* Typescript support eventually came out, which was a dramatic improvement in maintainability.
* A huge chunk of bugs in v4 was related to Apollo and how Data Colocation was not used properly. Relay entirely prevents these bugs from happening.
* Persisted Queries support for better performance, bundle size and security.
* Precompilation lead to better performance and bundle size.
* Relay moves in our direction, every version upgrade is exciting news for us.
* To understand how our graphql framework works we can now just point to the Relay documentation. It was an almost impossible task to explain our framework before.
* Relay detects problems in Queries during build time, whereas previously problems were only highlighted during runtime. This has led to faster development.
* Relay's Client Schema Extensions allowed us to replace Redux entirely. Wow.

### Negative Consequences

* Supporting a plugin architecture becomes much more difficult but not impossible.
* To use advanced features in Relay, we have to adhere to some conventions when structuring the schema. It's not a big issue however as our experience in v4 with Apollo has mostly led to the same or similar conventions.
