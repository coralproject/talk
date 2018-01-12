const { createClient } = require('../../services/redis');
const cache = require('../../services/cache');
const client = createClient();

beforeEach(() => Promise.all([client.flushdb(), cache.init()]));
