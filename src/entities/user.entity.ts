import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
