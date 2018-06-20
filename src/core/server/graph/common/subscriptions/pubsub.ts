import { RedisPubSub } from 'graphql-redis-subscriptions';
import { createRedisClient } from 'talk-server/services/redis';
import { Config } from 'talk-server/config';

export async function createPubSub(config: Config): Promise<RedisPubSub> {
    // Create the Redis clients for the PubSub server.
    const publisher = await createRedisClient(config);
    const subscriber = await createRedisClient(config);

    // Create the new PubSub manager.
    return new RedisPubSub({
        publisher,
        subscriber,
    });
}
