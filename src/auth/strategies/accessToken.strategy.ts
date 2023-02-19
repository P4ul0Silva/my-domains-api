import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt} from "passport-jwt";
import { Strategy } from "passport";

type JwtPayload = {
    sub: string;
    username: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrkey: process.env.JWT_ACCESS_SECRET
        });
    }

    validate(payload: JwtPayload) {
        return payload
    }
}