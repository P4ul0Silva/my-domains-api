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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
const users_service_1 = require("../users/users.service");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async hashData(data) {
        return await argon2.hash(data);
    }
    async signUp(createUserDto) {
        if (!createUserDto.email || !createUserDto.name || !createUserDto.password) {
            throw new common_1.HttpException('Fields cannot be empty', common_1.HttpStatus.BAD_REQUEST);
        }
        const userExists = await this.usersService.findOneByEmail(createUserDto.email);
        if (userExists) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.usersService.create(Object.assign(Object.assign({}, createUserDto), { password: hash }));
        return (0, class_transformer_1.plainToInstance)(user_entity_1.User, newUser);
    }
    async signIn(data) {
        const user = await this.usersService.findOneByEmail(data.email);
        if (!user) {
            throw new common_1.HttpException('Email or password incorret or user do not exist', common_1.HttpStatus.BAD_REQUEST);
        }
        const passwordMatches = await argon2.verify(user.password, data.password);
        if (!passwordMatches) {
            throw new common_1.HttpException('Email or password is incorrect or user do not exist', common_1.HttpStatus.BAD_REQUEST);
        }
        const tokens = await this.getTokens(user.id, user.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        return this.usersService.update(userId, { refreshToken: null });
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.updateToken(userId, {
            refreshToken: hashedRefreshToken,
        });
        return hashedRefreshToken;
    }
    async updatePassword(id, password) {
        const hash = await this.hashData(password);
        const user = await this.usersService.findOne(id);
        await this.usersService.update(id, Object.assign(Object.assign({}, user), { password: hash }));
    }
    async getTokens(userId, username) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: '60s',
            }),
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken)
            throw new common_1.HttpException('Access Denied', common_1.HttpStatus.FORBIDDEN);
        const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches)
            throw new common_1.HttpException('Access Denied', common_1.HttpStatus.FORBIDDEN);
        const tokens = await this.getTokens(user.id, user.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map