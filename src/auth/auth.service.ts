import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    hashData(data: string) {
        return argon2.hash(data);
      }

    async signUp(createUserDto: CreateUserDto): Promise<any> {
        const userExists = await this.usersService.findOneByNameOrEmail(createUserDto.email)

        if(userExists) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
        }

        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hash,
        });
        const tokens = await this.getTokens(newUser.id, newUser.name);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens
    }

    async signIn(data: AuthDto) {
        const user = await this.usersService.findOne(data.email);
        if (!user) throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
        const passwordMatches = await argon2.verify(user.password, data.password);
        if (!passwordMatches)
          throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
        const tokens = await this.getTokens(user.id, user.email);
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
              expiresIn: '15m',
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
}
