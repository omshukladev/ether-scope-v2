import { verifyToken } from "@clerk/backend";
import { apiError } from "../utils/apiError";

export const authMiddleware = async (c: any, next: any) => {
  const authHeader =
    c.req.header("authorization") || c.req.header("Authorization");

  if (!authHeader) {
    throw new apiError(401, "Missing Authorization header");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
    });

    c.set("userId", payload.sub);

    await next();
  } catch (error) {
    console.error("TOKEN VERIFY ERROR:", error);
    throw new apiError(401, "Invalid token");
  }
};
