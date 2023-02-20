import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signin(@Body() data: AuthDto) {
    const authUser = {
      email: data.email || '',
      password: data.password || ''
    }
    return await this.authService.signIn(authUser)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const refreshedToken = this.authService.refreshTokens(userId, refreshToken);
    return instanceToPlain(refreshedToken)
}

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req:Request) {
    this.authService.logout(req.user['sub'])
  }
}
