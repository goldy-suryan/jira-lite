import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

const option = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const pubSub = new RedisPubSub({
  publisher: new Redis(option),
  subscriber: new Redis(option),
});

export const COMMENT_ADDED = 'COMMENT_ADDED';
