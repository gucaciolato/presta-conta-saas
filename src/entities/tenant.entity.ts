import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Transaction } from './transaction.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  subdomain: string;

  @Column()
  organizationName: string;

  @Column()
  subscriptionPlan: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, user => user.tenant)
  users: User[];

  @OneToMany(() => Category, category => category.tenant)
  categories: Category[];

  @OneToMany(() => Transaction, transaction => transaction.tenant)
  transactions: Transaction[];
}
