import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestUserDto } from 'src/users/dto/request-user.dto';
import { Repository } from 'typeorm';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { Domain } from './entities/domain.entity';


@Injectable()
export class DomainsService {

  constructor(@InjectRepository(Domain) private domainsRepository: Repository<Domain>) {}

  async create(user: RequestUserDto,createDomainDto: CreateDomainDto): Promise<Domain> {

    if(!createDomainDto.created_at || !createDomainDto.domain || !createDomainDto.expires_at || !createDomainDto.owner_name || !createDomainDto.price) {
      throw new HttpException('Fields cannot be empty', HttpStatus.BAD_REQUEST)
    }

    if(await this.domainsRepository.findOneBy({domain: createDomainDto.domain, userId: user.sub})) {
      throw new HttpException('This domain already exists', HttpStatus.BAD_REQUEST)
    }

    const newDomain = this.domainsRepository.create({
      ...createDomainDto,
      userId: user.sub
    })
    
    try {
      await this.domainsRepository.save(newDomain)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

    return newDomain
  }

  async findAll(id: string) {
    try {
      return await this.domainsRepository.find({where: {user: {id}}})
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  async findOne(userId: string, id) {
    try {
      return await this.domainsRepository.findOneBy({userId, id})
    } catch (error) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND)
    }
  }

  async update(id: string, updateDomainDto: UpdateDomainDto) {
    try {
      const updateDomain = this.domainsRepository.findOneByOrFail({id})
      await this.domainsRepository.update(id, updateDomainDto)
      return await this.domainsRepository.findOneBy({id})
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }
  }

  async remove(id: string) {
    try {
      await this.domainsRepository.delete({id})
    } catch (error) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND)
    }
  }
}
