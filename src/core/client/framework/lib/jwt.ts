export interface JWT {
  header: {
    alg: string;
    typ: string;
  };
  payload: {
    iat?: number;
    exp?: number;
    iss?: string;
    sub?: string;
    jti?: string;
  };
  expired: boolean;
}

export function parseJWT(token: string, skewTolerance = 300): JWT {
  const [headerBase64, payloadBase64] = token.split(".");
  if (!headerBase64 && !payloadBase64) {
    throw new Error("invalid jwt token");
  }
  const header = JSON.parse(atob(headerBase64));
  const payload = JSON.parse(atob(payloadBase64));
  return {
    header,
    payload,
    get expired() {
      return Date.now() - skewTolerance < payload.exp;
    },
  };
}
