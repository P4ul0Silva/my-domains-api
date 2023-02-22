import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
export declare class DomainsController {
    private readonly domainsService;
    constructor(domainsService: DomainsService);
    create(req: any, createDomainDto: CreateDomainDto): Promise<import("./entities/domain.entity").Domain>;
    findAll(req: any): Promise<import("./entities/domain.entity").Domain[]>;
    findOne(req: any, id: string): Promise<import("./entities/domain.entity").Domain>;
    update(id: string, updateDomainDto: UpdateDomainDto): Promise<import("./entities/domain.entity").Domain>;
    remove(id: string): Promise<void>;
}
