import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt} from "passport-jwt";
import { Strategy } from "passport-local";
import * as dotenv from 'dotenv'
dotenv.config()

type JwtPayload = {
    sub: string;
    username: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        return payload
    }
}