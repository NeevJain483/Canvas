import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface RequestWithUser extends Request{
    user?:{id:string,username:string}
}

export interface CustomJwtPayload extends JwtPayload{
    id?:string,username?:string
}