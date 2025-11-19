import { ObjectType, Field, Int } from "type-graphql";
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";
import { Like } from "./like";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => String)
    @Column()
    body: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts)
    creator: User;

    @Field()
    @Column()
    creatorId: number;

    @Field(() => [Comment])
    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @Field()
    @Column({ default: 0 })
    likes: number;

    @OneToMany(() => Like, (like) => like.post)
    likesRelation: Like[];

    @Field(() => Int, { nullable: true })
    likeStatus: number | null;

    @Field(() => [String])
    @Column("json", { default: [] })
    attachments: string[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
