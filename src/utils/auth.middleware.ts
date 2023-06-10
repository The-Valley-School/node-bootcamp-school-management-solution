import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./token";
import { IUser } from "../domain/entities/user.entity";
import { userOdm } from "../domain/odm/user.odm";

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    // Descodificamos el token
    const decodedInfo = verifyToken(token);
    const user: IUser | null = await userOdm.getUserByEmailWithPassword(decodedInfo?.userEmail as string);
    if (!user) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.user = {
      id: user.id.toString(),
      email: user.email,
      rol: user.rol as any,
    };

    next();

    return null;
  } catch (error) {
    res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    return null;
  }
};

module.exports = { isAuth };
