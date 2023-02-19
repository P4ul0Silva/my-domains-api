import { Domain } from "src/domains/entities/domain.entity";
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string;

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @OneToMany(() => Domain, domain => domain.user)
    domains: Domain
}
