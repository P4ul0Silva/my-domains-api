import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async hashData(data: string) {
        return await argon2.hash(data);
      }

    async signUp(createUserDto: CreateUserDto): Promise<User> {

      if(!createUserDto.email || !createUserDto.name || !createUserDto.password) {
        throw new HttpException('Fields cannot be empty', HttpStatus.BAD_REQUEST)
      }

        const userExists = await this.usersService.findOneByNameOrEmail(createUserDto.email)

        if(userExists) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
        }

        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hash,
        });

        return plainToInstance(User, newUser)
    }

    async signIn(data: AuthDto) {
      console.log(data)
        const user = await this.usersService.findOneByNameOrEmail(data.email);
        console.log(user)
        if (!user) {
          throw new HttpException('Email or password incorret or user do not exist', HttpStatus.BAD_REQUEST);
        }
        const passwordMatches = await argon2.verify(user.password, data.password);

        if (!passwordMatches) {
          throw new HttpException('Email or password is incorrect or user do not exist', HttpStatus.BAD_REQUEST);
        }

        const tokens = await this.getTokens(user.id, user.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
      }

    async logout(userId: string) {
        return this.usersService.update(userId, { refreshToken: null })
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(userId, {
          refreshToken: hashedRefreshToken,
        });

        return hashedRefreshToken
      }

    async getTokens(userId: string, username: string) {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
          },
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '60s',
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            username,
          },
          {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
          },
        ),
      ]);
  
      return {
        accessToken,
        refreshToken,
      };
    }

    async refreshTokens(userId: string, refreshToken: string) {
      const user = await this.usersService.findOne(userId);
      if (!user || !user.refreshToken)
        throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
      const refreshTokenMatches = await argon2.verify(
        user.refreshToken,
        refreshToken,
      );
      if (!refreshTokenMatches) throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
      const tokens = await this.getTokens(user.id, user.name);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }
}
