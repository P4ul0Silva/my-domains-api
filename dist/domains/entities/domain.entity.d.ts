import { User } from "src/users/entities/user.entity";
export declare class Domain {
    id: string;
    domain: string;
    owner_name: string;
    created_at: string;
    expires_at: string;
    price: number;
    user: User;
    userId: string;
}
