import Redis from "ioredis";
import invariant from "invariant";

invariant(
  process.env.REDIS_PORT != null,
  "process.env.REDIS_PORT must be defined"
);
invariant(
  process.env.REDIS_HOST != null,
  "process.env.REDIS_HOST must be defined"
);
const redis = new Redis(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);
export default redis;
