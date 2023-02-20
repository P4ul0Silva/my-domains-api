import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RequestUserDto } from './dto/request-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    const users =  await this.usersService.findAll();
    return plainToInstance(User, users)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return plainToInstance(User, user)
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  async update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {

    const user: RequestUserDto = req.user

    if(user.sub.length < 36) {
      throw new HttpException('Invalid user ID, must be a valid 32 character UUID string', HttpStatus.NOT_FOUND)
    }
    const updatedUser = await this.usersService.update(user.sub, updateUserDto);
    return plainToInstance(User, updatedUser)
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
