"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const domain_entity_1 = require("./entities/domain.entity");
let DomainsService = class DomainsService {
    constructor(domainsRepository) {
        this.domainsRepository = domainsRepository;
    }
    async create(user, createDomainDto) {
        if (!createDomainDto.created_at || !createDomainDto.domain || !createDomainDto.expires_at || !createDomainDto.owner_name || !createDomainDto.price) {
            throw new common_1.HttpException('Fields cannot be empty', common_1.HttpStatus.BAD_REQUEST);
        }
        if (await this.domainsRepository.findOneBy({ domain: createDomainDto.domain, userId: user.sub })) {
            throw new common_1.HttpException('This domain already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const newDomain = this.domainsRepository.create(Object.assign(Object.assign({}, createDomainDto), { userId: user.sub }));
        try {
            await this.domainsRepository.save(newDomain);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
        return newDomain;
    }
    async findAll(id) {
        try {
            return await this.domainsRepository.find({ where: { user: { id } } });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async findOne(userId, id) {
        try {
            return await this.domainsRepository.findOneBy({ userId, id });
        }
        catch (error) {
            throw new common_1.HttpException('Domain not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, updateDomainDto) {
        try {
            const updateDomain = this.domainsRepository.findOneByOrFail({ id });
            await this.domainsRepository.update(id, updateDomainDto);
            return await this.domainsRepository.findOneBy({ id });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async remove(id) {
        try {
            await this.domainsRepository.delete({ id });
        }
        catch (error) {
            throw new common_1.HttpException('Domain not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
DomainsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(domain_entity_1.Domain)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DomainsService);
exports.DomainsService = DomainsService;
//# sourceMappingURL=domains.service.js.map