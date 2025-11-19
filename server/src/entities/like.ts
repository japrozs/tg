import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./post";
import { User } from "./user";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @Field()
    @Column({ type: "int", default: 1 })
    value: number;

    @Field()
    @PrimaryColumn()
    userId: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.likes)
    user: User;

    @Field()
    @PrimaryColumn()
    postId: string;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.likesRelation)
    post: Post;
}
