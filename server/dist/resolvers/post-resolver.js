"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const post_1 = require("../entities/post");
const is_auth_1 = require("../middleware/is-auth");
const type_graphql_1 = require("type-graphql");
const like_1 = require("../entities/like");
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    (0, type_graphql_1.Field)(() => [post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedPosts);
let PostResolver = class PostResolver {
    async likeStatus(post, { likeLoader, req }) {
        if (!req.session.userId) {
            return null;
        }
        const like = await likeLoader.load({
            postId: post.id,
            userId: req.session.userId,
        });
        return like ? 1 : null;
    }
    async createPost(body, { req, conn }) {
        const postRepository = conn.getRepository(post_1.Post);
        const post = postRepository.create({
            body,
            creatorId: req.session.userId,
        });
        return await postRepository.save(post);
    }
    async getPosts({ conn }) {
        return conn.getRepository(post_1.Post).find({
            relations: ["creator", "comments", "comments.creator"],
            order: { createdAt: "DESC" },
        });
    }
    async getPost(id, { conn }) {
        const postRepository = conn.getRepository(post_1.Post);
        return await postRepository
            .createQueryBuilder("post")
            .where("post.id = :id", { id })
            .leftJoinAndSelect("post.creator", "creator")
            .leftJoinAndSelect("post.comments", "comments")
            .leftJoinAndSelect("comments.creator", "commentCreator")
            .orderBy("comments.createdAt", "DESC")
            .getOne();
    }
    async like(postId, { req, conn }) {
        const { userId } = req.session;
        return await conn.transaction(async (manager) => {
            const likeRepository = manager.getRepository(like_1.Like);
            const postRepository = manager.getRepository(post_1.Post);
            const existingLike = await likeRepository.findOne({
                where: { userId, postId },
            });
            if (existingLike) {
                await likeRepository.remove(existingLike);
                await postRepository.decrement({ id: postId }, "likes", 1);
            }
            else {
                const newLike = likeRepository.create({
                    userId,
                    postId,
                    value: 1,
                });
                await likeRepository.save(newLike);
                await postRepository.increment({ id: postId }, "likes", 1);
            }
            return true;
        });
    }
    async deletePost(postId, { req, conn }) {
        try {
            await conn.getRepository(post_1.Post).delete({
                id: postId,
                creatorId: req.session.userId,
            });
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
};
exports.PostResolver = PostResolver;
__decorate([
    (0, type_graphql_1.FieldResolver)(() => type_graphql_1.Int, { nullable: true }),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_1.Post, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "likeStatus", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(is_auth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => post_1.Post),
    __param(0, (0, type_graphql_1.Arg)("body")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Query)(() => [post_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(is_auth_1.isAuth),
    (0, type_graphql_1.Query)(() => post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(is_auth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "like", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(is_auth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
exports.PostResolver = PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(post_1.Post)
], PostResolver);
//# sourceMappingURL=post-resolver.js.map