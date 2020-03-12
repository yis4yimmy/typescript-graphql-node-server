import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  @Index({ unique: true })
  username: string;

  @Column({ type: "varchar", length: 255, unique: true })
  @Index({ unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  locked: boolean;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
