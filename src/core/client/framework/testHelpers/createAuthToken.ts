export default function createAuthToken() {
  return `${btoa(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  )}.${btoa(
    JSON.stringify({
      jti: "31b26591-4e9a-4388-a7ff-e1bdc5d97cce",
    })
  )}`;
}
