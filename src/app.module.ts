import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './feature/user/entity/user';
import { UserModule } from './feature/user/module/user.module';
import { LogUserEntity } from './feature/user/entity/log_user';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'db_rimba_test',
        entities: [UserEntity, LogUserEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule
  ],
  providers: [],
})
export class AppModule { }