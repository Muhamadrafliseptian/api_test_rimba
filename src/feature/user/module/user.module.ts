import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../entity/user';
import { UserController } from '../controller/user.controller';
import { UserServices } from '../services/user.service';
import { LogUserEntity } from '../entity/log_user';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, LogUserEntity]), ConfigModule.forRoot()],
    controllers: [UserController],
    providers: [UserServices],
})
export class UserModule { }
