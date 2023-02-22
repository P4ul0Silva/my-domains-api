import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { DomainsModule } from './domains/domains.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv'
dotenv.config();

@Module({
  imports: [AuthModule, UsersModule, DomainsModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
    ssl: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
