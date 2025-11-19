import { Post } from "../entities/post";
import { isAuth } from "../middleware/is-auth";
import { Context } from "../types";
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { Like } from "../entities/like";

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];

    @Field()
    hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => Int, { nullable: true })
    async likeStatus(@Root() post: Post, @Ctx() { likeLoader, req }: Context) {
        if (!req.session.userId) {
            return null;
        }
        const like = await likeLoader.load({
            postId: post.id,
            userId: req.session.userId,
        });

        return like ? 1 : null;
    }

    @UseMiddleware(isAuth)
    @Mutation(() => Post)
    async createPost(@Arg("body") body: string, @Ctx() { req, conn }: Context) {
        const postRepository = conn.getRepository(Post);
        const post = postRepository.create({
            body,
            creatorId: req.session.userId,
        });
        return await postRepository.save(post);
    }

    @Query(() => [Post])
    async getPosts(@Ctx() { conn }: Context) {
        return conn.getRepository(Post).find({
            relations: ["creator", "comments", "comments.creator"],
            order: { createdAt: "DESC" },
        });
    }

    @UseMiddleware(isAuth)
    @Query(() => Post, { nullable: true })
    async getPost(
        @Arg("id", () => String) id: string,
        @Ctx() { conn }: Context
    ) {
        const postRepository = conn.getRepository(Post);

        return await postRepository
            .createQueryBuilder("post")
            .where("post.id = :id", { id })
            .leftJoinAndSelect("post.creator", "creator")
            .leftJoinAndSelect("post.comments", "comments")
            .leftJoinAndSelect("comments.creator", "commentCreator")
            .orderBy("comments.createdAt", "DESC")
            .getOne();
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async like(@Arg("postId") postId: string, @Ctx() { req, conn }: Context) {
        const { userId } = req.session;

        return await conn.transaction(async (manager) => {
            const likeRepository = manager.getRepository(Like);
            const postRepository = manager.getRepository(Post);

            const existingLike = await likeRepository.findOne({
                where: { userId, postId },
            });

            if (existingLike) {
                // Unlike: remove and decrement
                await likeRepository.remove(existingLike);
                await postRepository.decrement({ id: postId }, "likes", 1);
            } else {
                // Like: add and increment
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

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("postId") postId: string,
        @Ctx() { req, conn }: Context
    ) {
        try {
            await conn.getRepository(Post).delete({
                id: postId,
                creatorId: req.session.userId,
            });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
