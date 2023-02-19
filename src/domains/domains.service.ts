import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { Domain } from './entities/domain.entity';


@Injectable()
export class DomainsService {

  constructor(@InjectRepository(Domain) domainsRepository: Repository<Domain>) {}

  create(createDomainDto: CreateDomainDto) {
    return 'This action adds a new domain';
  }

  findAll() {
    return `This action returns all domains`;
  }

  findOne(id: number) {
    return `This action returns a #${id} domain`;
  }

  update(id: number, updateDomainDto: UpdateDomainDto) {
    return `This action updates a #${id} domain`;
  }

  remove(id: number) {
    return `This action removes a #${id} domain`;
  }
}
