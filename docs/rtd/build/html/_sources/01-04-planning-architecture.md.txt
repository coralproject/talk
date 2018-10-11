# Planning your Talk Architecture

Talk is architected to be able to run on as little as 500MB of RAM. To do this however you will need to use the pre-compiled Docker container, as compiling the code and dependencies will cause a memory spike.

For the average small blog or newsroom, these are our recommended machines:

- **Digital Ocean**: ~$5/month for their 1GB droplet
- **Google Cloud**: ~$14/month for a g1 small
- **AWS**: ~$16/month for a t2small

From there, you’re free to separate app servers and DB servers, and scale up as much as you need.

One larger newsroom’s setup, as an example of Talk performing at scale, is:

Application servers: c4.xlarge (16 VM nginx + Talk VM machine pairs)
Mongo nodes: 3x c3.medium (large db cluster, 1 master, 2 read replicas)

If you need help with Talk performance or want custom scaling help or recommendations, let us know by logging a ticket and one of our engineers will get in touch with you: https://support.coralproject.net
