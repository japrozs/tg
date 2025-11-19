import { Comment } from "../entities/comment";
import { isAuth } from "../middleware/is-auth";
import { Context } from "../types";
import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";

@Resolver(Comment)
export class CommentResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => Comment)
    async createComment(
        @Arg("postId") postId: string,
        @Arg("body") body: string,
        @Ctx() { req, conn }: Context
    ) {
        const commentRepository = conn.getRepository(Comment);

        const comment = commentRepository.create({
            creatorId: req.session.userId,
            postId,
            body,
        });

        return await commentRepository.save(comment);
    }

    @UseMiddleware(isAuth)
    @Query(() => [Comment])
    async getComments(
        @Arg("id", () => String) id: string,
        @Ctx() { conn }: Context
    ) {
        const commentRepository = conn.getRepository(Comment);

        return await commentRepository.find({
            where: { postId: id },
            relations: ["creator"],
            order: { createdAt: "DESC" },
        });
    }
}
