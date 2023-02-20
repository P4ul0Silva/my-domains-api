export class CreateUserDto {
    readonly token: string;
    readonly refreshToken: string;
    readonly id: string;
    readonly userId: string;
    name: string;
    email: string;
    password: string;
}
