// store.js
'use strict';

const redis = require('redis');

let store = {
  isRedis: false, // flag to check if Redis is being used
  client: redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
  }),
  memory: new Map() // fallback in-memory store
};

module.exports = store;
