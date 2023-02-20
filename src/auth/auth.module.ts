import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { DomainsModule } from 'src/domains/domains.module';
import * as dotenv from 'dotenv'
import { PassportModule } from '@nestjs/passport';
dotenv.config()

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: {expiresIn: '60s'}
  }), UsersModule, DomainsModule, PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, ConfigService],
  exports: [AuthService]
})
export class AuthModule {}
