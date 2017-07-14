---
title: Microservice Deployments
keywords: install
sidebar: talk_sidebar
permalink: install-microservices.html
summary:
---

In Talk, we seek to deliver the simplicity of a monolith with the advantages of a microservice based infrastructure for those who want them.

To accomplish this, Talk has the ability to run with subsets of its overall functionality and contains architecture that allows them to operate logically as microservices when running in a single environment.

## Talk Server Functionalities

The Talk server serves several logically/architecturally distinct functions:

* A web server that
  * serves "public" assets (aka, the comment embed)  
  * "protected" assets (aka, the admin console) over http(s)
  * the GraphQL endpoints
* A web socket server that handles subscriptions.
* A jobs processor that handles queued operations.

In the documentation so far, we've discussed how to deploy all of these functionalities bundled into a single monolith application. This is convenient as there is minimal configuration and horizontal scaling is as easy as upping the number of servers behind a single load balancer.

## Separating Talk into Microservices

Talk can be run as three separate clusters of servers by enabling/disabling different bits of functionality: webserver, socket server and jobs server.

Each microservice would deploy with the same codebase and configuration.

Note that the `cli serve` command, which is responsible for starting the server, contains flags that control whether `jobs` and `websockets` are enabled.

```
talk :) ]$ bin/cli serve --help

  Options:

    ...
    -j, --jobs           enable job processing on this thread
    -w, --websockets     enable the websocket (subscriptions) handler on this thread
    ...
```

Each Talk Microservice cluster can be deployed in an identical manner described in the other docs in this section with the omission of the `-j` and/or `-w` flags.

With routing logic in front of the webserver cluster, separation between public and protected assets can be achieved.

## When should I consider separating?

Consider a microservice deployment if:

* you want to put access to admin routes behind a firewall
* you are running plugins that require intensive job processing
* you do not want to simplicity of single cluster horizontal scaling and want to tune the economy and performance of your install.

At scale, combining separate concerns in a single process makes it very difficult to understand what is taking up resources. With microservices, each server could be configured to sit behind it's own load balance and scale independently. Each variety of process can always have just enough resources.

An install that heavily utilizes the jobs queue could see delays in http service because of heavy jobs processes and/or delays in the execution of jobs processes due to increased server load.

## Deployment Methodologies

Note that there is no flag to separate the http routes on the webserver. Separating the http server functionalities can be accomplished by the routing of various routes to the correct http server. This can ensure that sensitive areas, such as the `/admin/` route are not available outside the firewall.

Talk's Queue is backed by Redis, so as long as all Talk instances access the same Redis cluster no additional configuration is needed when launching an independent jobs cluster.

If there are any features of Talk that you believe should be disable-able via server flags, please let us know and consider contributing it to the project!

## Deployment Flows/Scripts

We do not currently support any microservice based deployment flows. If you develop one yourself that is completely based on open source tooling, please consider contributing it to the project!
