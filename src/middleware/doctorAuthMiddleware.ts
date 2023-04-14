import { Request, Response, NextFunction } from "express";
import { veriftyJwtToken } from "../util";

export function doctorAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization;
    if(!token) {
        return next(new Error("token not found"));
    }
    token = token.split(" ")[1];
    const response = veriftyJwtToken(token);
    if(!response || !response.specialization) {
        return next(new Error("unauthorized user"));
    }
    req["user"] = response;
    next();
}