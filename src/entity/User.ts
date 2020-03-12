import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "varchar", length: 255, unique: true })
  @Index({ unique: true })
  username: string;

  @Field()
  @Column({ type: "varchar", length: 255, unique: true })
  @Index({ unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  locked: boolean;

  @Field()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
