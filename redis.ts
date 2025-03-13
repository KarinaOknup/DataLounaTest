import Redis from "redis";

const redisClient = Redis.createClient({url: 'redis://localhost:6379' });

redisClient.on('ready', () => {
    console.log('Connected to redis');
  });

redisClient.on('error', err => {
    console.log('Error occurred while connection to redis server', err);
  });

await redisClient.connect();

export default redisClient;