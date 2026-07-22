import { UserRole } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";


export const authorize =
(...roles: UserRole[]) =>
(req: AuthRequest,res:Response,next:NextFunction)=>{

if(!roles.includes(req.user.role)){

return res.status(403).json({
success:false,
message:"Forbidden"
});

}

next();

};