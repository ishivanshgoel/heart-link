import { Request, Response, NextFunction } from "express";
import { veriftyJwtToken } from "../util";

export function doctorAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization;
    if(!token) {
        next(new Error("token not found"));
    }
    token = token[1];
    const response = veriftyJwtToken(token);
    if(!response || !response.specialization) {
        next(new Error("unauthorized user"));
    }
    req["payload"] = response;
    next();
}