import { Domain } from "src/domains/entities/domain.entity";
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    domains: Domain;
    refreshToken: string;
}
