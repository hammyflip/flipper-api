import type { Express } from "express-serve-static-core";
import cors from "cors";
import express from "express";
import getRecentPlays from "src/api/get/getRecentPlays";
import processFlip from "src/api/post/processFlip";

function useMiddleware(app: Express): void {
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    })
  );
}

export default function getApp(): Express {
  const app = express();

  // Needed when behind Nginx.
  app.enable("trust proxy");

  useMiddleware(app);

  app.get("/", async (req, res) => {
    res.send("Hello beebop");
  });

  app.get("/getRecentPlays", getRecentPlays);

  app.post("/processFlip", processFlip);

  return app;
}
