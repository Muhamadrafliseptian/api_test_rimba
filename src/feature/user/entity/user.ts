import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tb_users_rimba'})
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id_users: string

    @Column({type: 'varchar'})
    name: string

    @Column({type: 'varchar'})
    email: string

    @Column()
    age: number
}