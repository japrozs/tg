import DataLoader from "dataloader";
import { Like } from "../entities/like";

export const createLikeLoader = () =>
    new DataLoader<{ postId: string; userId: number }, Like | null>(
        async (keys) => {
            const likes = await Like.find({
                where: keys.map((key) => ({
                    userId: key.userId,
                    postId: key.postId,
                })),
            });

            const likeIdsToLike: Record<string, Like> = {};
            likes.forEach((like) => {
                likeIdsToLike[`${like.userId}|${like.postId}`] = like;
            });

            return keys.map(
                (key) => likeIdsToLike[`${key.userId}|${key.postId}`] || null
            );
        }
    );
