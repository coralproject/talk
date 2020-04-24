import jwt from "jsonwebtoken";

const TOKEN_JTI = "31b26591-4e9a-4388-a7ff-e1bdc5d97cce";
const TOKEN_SECRET = "test-secret";

export default function createAccessToken(payload = {}) {
  return jwt.sign({ jti: TOKEN_JTI, ...payload }, TOKEN_SECRET, {
    algorithm: "HS256",
  });
}
