import { Redis } from "ioredis";
import { Request, Response } from "express";

export interface AppContext {
  redisClient: Redis;
  req: Request;
  res: Response;
}
