import "reflect-metadata";
import "dotenv-safe/config";
import { DataSource } from "typeorm";
import path from "path";
import express, { Application } from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import cors from "cors";
import { COOKIE_NAME } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { User } from "./entities/user";
import { UserResolver } from "./resolvers/user-resolver";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import playground from "graphql-playground-middleware-express";
import { Post } from "./entities/post";
import { Comment } from "./entities/comment";
import { Like } from "./entities/like";
import { createLikeLoader } from "./utils/create-like-loader";
import { PostResolver } from "./resolvers/post-resolver";
import { CommentResolver } from "./resolvers/comment-resolver";
import upload from "./upload";

const main = async () => {
    const conn = new DataSource({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [User, Comment, Post, Like],
    });
    await conn.initialize();
    await conn.runMigrations();

    const app: Application = express();
    const redis = createClient({
        url: process.env.REDIS_URL,
    });
    redis.connect().catch(console.error);
    const redisStore = new RedisStore({
        client: redis,
        disableTouch: true,
    });

    // const allowedOrigins = [
    //     process.env.CORS_ORIGIN,
    //     "https://studio.apollographql.com",
    // ];
    app.set("trust proxy", 1);
    // app.use(
    //     cors({
    //         origin: (origin, callback) => {
    //             if (!origin) return callback(null, true);
    //             if (allowedOrigins.indexOf(origin) !== -1)
    //                 return callback(null, true);
    //             return callback(new Error("CORS not allowed by server"), false);
    //         },
    //         credentials: true,
    //     })
    // );

    app.use(
        cors({
            origin: [
                "http://localhost:3000", // your frontend
                "http://localhost:4000", // your playground
                "https://studio.apollographql.com", // optional for sandbox
                process.env.CORS_ORIGIN, // optional custom
            ],
            credentials: true,
        })
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: redisStore,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1000 * 60 * 60 * 24 * 7, // 1 week
                httpOnly: true,
                secure: false,
                domain: undefined,
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
        }) as any
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver, CommentResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            conn,
            likeLoader: createLikeLoader(),
        }),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
    });
    await apolloServer.start();

    app.get("/graphql", playground({ endpoint: "/graphql" }));
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
    app.use("/upload/", upload);

    apolloServer.applyMiddleware({
        app: app as any,
        cors: false,
        path: "/graphql",
    });

    app.listen(parseInt(process.env.PORT), () => {
        console.log(`🚀 Server started on localhost:${process.env.PORT}`);
    });
};

main().catch((err: Error) => console.error(err));
