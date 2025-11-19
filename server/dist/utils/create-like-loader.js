"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLikeLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const like_1 = require("../entities/like");
const createLikeLoader = () => new dataloader_1.default(async (keys) => {
    const likes = await like_1.Like.find({
        where: keys.map((key) => ({
            userId: key.userId,
            postId: key.postId,
        })),
    });
    const likeIdsToLike = {};
    likes.forEach((like) => {
        likeIdsToLike[`${like.userId}|${like.postId}`] = like;
    });
    return keys.map((key) => likeIdsToLike[`${key.userId}|${key.postId}`] || null);
});
exports.createLikeLoader = createLikeLoader;
//# sourceMappingURL=create-like-loader.js.map