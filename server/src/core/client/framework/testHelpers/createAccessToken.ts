const TOKEN_JTI = "31b26591-4e9a-4388-a7ff-e1bdc5d97cce";

function encodePart(obj: object): string {
  return btoa(JSON.stringify(obj));
}

export default function createAccessToken(payload = {}) {
  return [
    { kid: "96c8066a-d987-4282-83f9-da516797f9fc", alg: "HS256" },
    { jti: TOKEN_JTI, ...payload },
    null,
  ]
    .map((obj) => (obj ? encodePart(obj) : obj))
    .join(".");
}
