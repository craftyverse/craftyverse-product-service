import Redis from "ioredis";

export class RedisService {
  private static redisClient: Redis;

  static createRedisClient(): Redis {
    if (!RedisService.redisClient) {
      RedisService.redisClient = new Redis({
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD!,
      });
    }
    return RedisService.redisClient;
  }

  static async set(key: string, value: string): Promise<string> {
    const redisClient = RedisService.createRedisClient();
    return redisClient.set(key, value);
  }

  static async get(key: string): Promise<string | null> {
    const redisClient = RedisService.createRedisClient();
    return redisClient.get(key);
  }

  static async delete(key: string): Promise<number | null> {
    const redisClient = RedisService.createRedisClient();
    return redisClient.del(key);
  }
}
