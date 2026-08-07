import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No authorization token." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tajni_kljuc_za_dev",
    ) as JwtPayload;

    req.userId = decoded.id as string;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Error! Invalid token." });
  }
};
