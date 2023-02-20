import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RequestUserDto } from 'src/users/dto/request-user.dto';
import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Req() req: any ,@Body() createDomainDto: CreateDomainDto) {
    const user: RequestUserDto = req.user
    return await this.domainsService.create(user ,createDomainDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub
    console.log(userId)
    return await this.domainsService.findAll(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub
    return await this.domainsService.findOne(userId, id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    return await this.domainsService.update(id, updateDomainDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.domainsService.remove(id);
  }
}
