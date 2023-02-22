import { RequestUserDto } from 'src/users/dto/request-user.dto';
import { Repository } from 'typeorm';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { Domain } from './entities/domain.entity';
export declare class DomainsService {
    private domainsRepository;
    constructor(domainsRepository: Repository<Domain>);
    create(user: RequestUserDto, createDomainDto: CreateDomainDto): Promise<Domain>;
    findAll(id: string): Promise<Domain[]>;
    findOne(userId: string, id: any): Promise<Domain>;
    update(id: string, updateDomainDto: UpdateDomainDto): Promise<Domain>;
    remove(id: string): Promise<void>;
}
