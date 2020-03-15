import { Redis } from "ioredis";

export interface AppContext {
  redisClient: Redis;
}
