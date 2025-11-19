import { Request, Response } from "express";
import session from "express-session";
import { Redis } from "ioredis";
import { DataSource } from "typeorm";
import { createLikeLoader } from "./utils/create-like-loader";
// import { createLikeLoader } from "./utils/like-loader";

declare module "express-session" {
    interface SessionData {
        userId: any;
    }
}

export type Context = {
    req: Request & { session: session.Session };
    redis: Redis;
    res: Response;
    conn: DataSource;
    likeLoader: ReturnType<typeof createLikeLoader>;
};
