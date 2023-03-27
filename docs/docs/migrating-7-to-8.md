---
title: Migrating from v7.x to v8+
---

Coral v8.0.0 does not include incompatible API changes, however, it includes a large change to the way data retrieval works, the **Coral Redis Cache**, that may impact resource needs. You may wish to make infrastructure or hosting changes to better optimize for v8+.

## Coral Redis Cache

The redis cache is a means of speeding up the retrieval speed of a comment stream by caching its comments, users, and comment actions data in redis and retrieving it from redis instead of Mongo.

We created the redis cache because retrieving extremely large and highly active comment streams is very expensive to query when using Mongo and GraphQL by itself. An optimization was needed to be able to handle streams with 4000+ comments which has possibly 500+ active users on the stream.

We created the redis cache to be able to handle streams of this size (and larger) while maintaining usable stream performance.

We also created the redis cache to avoid the ever ballooning costs of scaling up our Mongo instance to handle these ever larger comment streams. Now that redis is serving the hot traffic of our newsrooms straight from memory instead of retrieving it from a slower database, we are able to downscale our Mongo instances. This nets us a huge cost savings as Mongo database instances are expensive to scale up.

## Differences between Coral v7.x and v8+

Coral now relies heavily on its redis instance and somewhat more on the compute and memory performance of its individual Coral deployments.

Data for a stream is now primarily retrieved from redis. Mongo now serves as a write store for the comment data. This nets you the best of both worlds, fast data read speeds and reliable long term data persistence.

## Differences in resource demands and requirements

Unfortunately, yes, some changes have to be made. Namely, it is wise to beef up whatever redis instance you are using with Coral. It is also recommended that you beef up the CPU performance of whatever pods, vm's, or containers you have hosting Coral as well as provisioning more RAM to each Coral instance (or pod).

### Redis

With the redis cache enabled, Coral's redis instances have roughly 5 GB of RAM and can handle 500 MB/s of throughput per newsroom tenant.

### CPU and RAM

We quadrupled the CPU and RAM of each of our Coral instances. Coral usually runs in a pod (deployed Docker container) within a node on kubernetes. Typically you see allocations of this being milli-cpus (mCPU's) and MB of RAM.

Example allocation for a single Coral pod:

| No Redis Cache                | With Redis Cache              |
|-------------------------------|-------------------------------|
| 350 mCPU                      | 1500 mCPU                     |
| 1024 MB RAM                   | 4096 MB RAM                   |
| 5-10 concurrent users per pod | 250+ concurrent users per pod |

An added benefit to adding more CPU to the pod is that web socket traffic will also be fulfilled more quickly on top of the redis cache improvements. This will result in a snappier stream behaviour for your users.

## Infrastructure costs

It may appear that this may lead to increased hosting costs, but we believe it will be net neutral or cheaper.

The optimizations from the redis cache allow each pod to resolve comment and web socket data a lot more quickly. By upping the CPU and RAM, along with using the redis cache changes, each pod can handle 10-100x more traffic than a previous pod could. This is because the pod is now directly drinking from the proverbial redis fire-hose.

We have to add more CPU because the pod needs it to devour the rapid data we get from redis. We also add RAM because Coral is now capable of fully caching per-request comment data in memory to optimize the GraphQL resolver resolutions.

By adding CPU and RAM along with redis cache, you supercharge your Coral API when serving comment stream traffic.

In most cases, you will see that you now need less pods to handle your traffic and will likely see a cost savings for your hosting.

You're making a trade of 4x more CPU/RAM for 10-100x faster processing of web requests.

Because of the reduced demand on mongo, We were able to scale one of our largest mongo instances down accordingly:

| No Redis Cache         | With Redis Cache       |
|------------------------|------------------------|
| 192 GB of RAM          | 64 GB of RAM           |
| 48 vCPUs               | 16 vCPUs               |
| 96,000 max connections | 32,000 max connections |

This is a 3x reduction in hosting requirements for Mongo when using the redis cache. Since Mongo is the most expensive hosting cost when serving Coral, this should be a dramatic cost saving for you as well.

## Managing Story Caching

Though caching is all handled automatically, you can manage caching on a per-story basis if desired. Find the story via the Stories tab in your Coral Admin, then click the `...` actions for that story. In the Story Details Drawer, you will see a button labelled **Recache Story** if the story has not been cached, and if it has, you will see both **Recache Story** and **Uncache Story**. Clicking **Uncache Story** will manually invalidate the Redis cache.

