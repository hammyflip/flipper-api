import { NextFunction, Request, Response } from "express";

// TODO: implement
export default async function processBet(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  // const { txid } = req.body;

  res.json({ success: true });
}
