import type { Express } from "express-serve-static-core";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import isProd from "src/utils/isProd";
import redis from "src/utils/redis";
import session from "express-session";

export const SESSION_COOKIE = isProd() ? "TODO-session" : "TODO-session-dev";

function useMiddleware(app: Express): void {
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    })
  );

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: SESSION_COOKIE,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: isProd() ? process.env.CLIENT_DOMAIN : undefined,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        secure: isProd(),
      },
    })
  );
}

export default function getApp(): Express {
  const app = express();

  // Needed when behind Nginx.
  app.enable("trust proxy");

  useMiddleware(app);

  app.get("/", async (req, res) => {
    res.send("Hello World!");
  });

  return app;
}
