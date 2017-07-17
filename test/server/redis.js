const redis = require('../helpers/redis');
const cache = require('../../services/cache');

beforeEach(() => Promise.all([redis.clearDB(), cache.init()]));
