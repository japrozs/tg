"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv-safe/config");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = require("connect-redis");
const redis_1 = require("redis");
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./entities/user");
const user_resolver_1 = require("./resolvers/user-resolver");
const apollo_server_core_1 = require("apollo-server-core");
const graphql_playground_middleware_express_1 = __importDefault(require("graphql-playground-middleware-express"));
const post_1 = require("./entities/post");
const comment_1 = require("./entities/comment");
const like_1 = require("./entities/like");
const create_like_loader_1 = require("./utils/create-like-loader");
const post_resolver_1 = require("./resolvers/post-resolver");
const comment_resolver_1 = require("./resolvers/comment-resolver");
const upload_1 = __importDefault(require("./upload"));
const main = async () => {
    const conn = new typeorm_1.DataSource({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [user_1.User, comment_1.Comment, post_1.Post, like_1.Like],
    });
    await conn.initialize();
    await conn.runMigrations();
    const app = (0, express_1.default)();
    const redis = (0, redis_1.createClient)({
        url: process.env.REDIS_URL,
    });
    redis.connect().catch(console.error);
    const redisStore = new connect_redis_1.RedisStore({
        client: redis,
        disableTouch: true,
    });
    app.set("trust proxy", 1);
    app.use((0, cors_1.default)({
        origin: [
            "http://localhost:3000",
            "http://localhost:4000",
            "https://studio.apollographql.com",
            process.env.CORS_ORIGIN,
        ],
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: redisStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: false,
            domain: undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [user_resolver_1.UserResolver, post_resolver_1.PostResolver, comment_resolver_1.CommentResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            conn,
            likeLoader: (0, create_like_loader_1.createLikeLoader)(),
        }),
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)()],
    });
    await apolloServer.start();
    app.get("/graphql", (0, graphql_playground_middleware_express_1.default)({ endpoint: "/graphql" }));
    app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
    app.use("/upload/", upload_1.default);
    apolloServer.applyMiddleware({
        app: app,
        cors: false,
        path: "/graphql",
    });
    app.listen(parseInt(process.env.PORT), () => {
        console.log(`🚀 Server started on localhost:${process.env.PORT}`);
    });
};
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map