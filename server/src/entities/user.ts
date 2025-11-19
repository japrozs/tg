import { Field, ObjectType } from "type-graphql";
import {
    Column,
    CreateDateColumn,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { Post } from "./post";
import { Comment } from "./comment";
import { Like } from "./like";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column({ default: "uploads/profile-icon.png" })
    avatar: string;

    @Field()
    @Column({ default: "hey there! i am using tailgate" })
    bio: string;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    password!: string;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    @Field(() => [Comment])
    @OneToMany(() => Comment, (comment) => comment.creator)
    comments: Comment[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
