import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err: Error) => console.error("Redis Error:", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis Connection Error:", error);
  }
};

connectRedis();

export default redisClient;
