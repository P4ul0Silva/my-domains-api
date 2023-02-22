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
exports.DomainsController = void 0;
const common_1 = require("@nestjs/common");
const accessToken_guard_1 = require("../common/guards/accessToken.guard");
const domains_service_1 = require("./domains.service");
const create_domain_dto_1 = require("./dto/create-domain.dto");
const update_domain_dto_1 = require("./dto/update-domain.dto");
let DomainsController = class DomainsController {
    constructor(domainsService) {
        this.domainsService = domainsService;
    }
    async create(req, createDomainDto) {
        const user = req.user;
        return await this.domainsService.create(user, createDomainDto);
    }
    async findAll(req) {
        const userId = req.user.sub;
        return await this.domainsService.findAll(userId);
    }
    async findOne(req, id) {
        const userId = req.user.sub;
        return await this.domainsService.findOne(userId, id);
    }
    async update(id, updateDomainDto) {
        return await this.domainsService.update(id, updateDomainDto);
    }
    async remove(id) {
        return await this.domainsService.remove(id);
    }
};
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_domain_dto_1.CreateDomainDto]),
    __metadata("design:returntype", Promise)
], DomainsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DomainsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DomainsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_domain_dto_1.UpdateDomainDto]),
    __metadata("design:returntype", Promise)
], DomainsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DomainsController.prototype, "remove", null);
DomainsController = __decorate([
    (0, common_1.Controller)('domains'),
    __metadata("design:paramtypes", [domains_service_1.DomainsService])
], DomainsController);
exports.DomainsController = DomainsController;
//# sourceMappingURL=domains.controller.js.map