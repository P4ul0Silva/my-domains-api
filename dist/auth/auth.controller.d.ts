import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
    signin(data: AuthDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(req: Request): Record<string, any>;
    changePassword(req: any): Promise<void>;
    logout(req: Request): void;
}
