import { User } from "src/users/entities/user.entity";
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Domain {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({unique: true})
    domain: string

    @Column()
    owner_name: string

    @Column({ type: 'date'})
    created_at: string
    
    @Column({ type: 'date'})
    expires_at: string

    @Column({type: 'decimal', precision:10, scale: 2})
    price: number

    @ManyToOne(() => User, (user) => user.domains)
    user: User
}
