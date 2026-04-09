import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function hasUpstashEnv(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export function getRedis(): Redis | null {
  if (!hasUpstashEnv()) return null;
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.KV_REST_API_URL as string,
      token: process.env.KV_REST_API_TOKEN as string,
    });
  }
  return redisClient;
}
