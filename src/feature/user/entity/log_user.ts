import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity({ name: 'tb_log_userrequest' })
export class LogUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    method: string;

    @Column()
    path: string;

    @Column()
    status: number;

    @Column()
    duration: number;

    @CreateDateColumn({ type: 'timestamp' })
    timestamp: Date;
}
