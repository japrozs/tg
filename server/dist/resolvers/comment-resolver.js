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
exports.CommentResolver = void 0;
const comment_1 = require("../entities/comment");
const is_auth_1 = require("../middleware/is-auth");
const type_graphql_1 = require("type-graphql");
let CommentResolver = class CommentResolver {
    async createComment(postId, body, { req, conn }) {
        const commentRepository = conn.getRepository(comment_1.Comment);
        const comment = commentRepository.create({
            creatorId: req.session.userId,
            postId,
            body,
        });
        return await commentRepository.save(comment);
    }
    async getComments(id, { conn }) {
        const commentRepository = conn.getRepository(comment_1.Comment);
        return await commentRepository.find({
            where: { postId: id },
            relations: ["creator"],
            order: { createdAt: "DESC" },
        });
    }
};
exports.CommentResolver = CommentResolver;
__decorate([
    (0, type_graphql_1.UseMiddleware)(is_auth_1.isAuth),
    (0, type_graphql_1.Mutation)(() => comment_1.Comment),
    __param(0, (0, type_graphql_1.Arg)("postId")),
    __param(1, (0, type_graphql_1.Arg)("body")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "createComment", null);
__decorate([
    (0, type_graphql_1.UseMiddleware)(is_auth_1.isAuth),
    (0, type_graphql_1.Query)(() => [comment_1.Comment]),
    __param(0, (0, type_graphql_1.Arg)("id", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "getComments", null);
exports.CommentResolver = CommentResolver = __decorate([
    (0, type_graphql_1.Resolver)(comment_1.Comment)
], CommentResolver);
//# sourceMappingURL=comment-resolver.js.map