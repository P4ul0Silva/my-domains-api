import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
@Patch('change-password')
async changePassword(@Req() req: any) {
  console.log(req.user.sub)
  console.log(req.body.password)
  await this.authService.updatePassword(req.user.sub, req.body.password)
}

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req:Request) {
    this.authService.logout(req.user['sub'])
  }
}
