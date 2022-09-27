import {
  createJWTSigningConfig,
  extractTokenFromRequest,
} from "coral-server/services/jwt";
import { Request } from "coral-server/types/express";

describe("extractJWTFromRequest", () => {
  it("extracts the token from header", () => {
    const req = {
      headers: {
        authorization: "Bearer token",
      },
      url: "",
    };

    expect(extractTokenFromRequest(req as any as Request)).toEqual("token");

    delete req.headers.authorization;

    expect(extractTokenFromRequest(req as any as Request)).toEqual(null);
  });

  it("extracts the token from query string", () => {
    const req = {
      url: "",
      headers: {},
    };
    expect(extractTokenFromRequest(req as any as Request)).toEqual(null);

    req.url = "https://coral.coralproject.net/api?accessToken=token";

    expect(extractTokenFromRequest(req as any as Request)).toEqual("token");
  });

  it("does not extract the token from query string when it's disabled", () => {
    const req = {
      url: "https://coral.coralproject.net/api?accessToken=token",
      headers: {},
    };

    expect(extractTokenFromRequest(req as any as Request, true)).toEqual(null);
  });
});

describe("createJWTSigningConfig", () => {
  it("parses a RSA certificate", () => {
    const input = `-----BEGIN RSA PRIVATE KEY-----\\nMIIEpQIBAAKCAQEAyxR2DVlvkQRquggUQTpHN+PxDs2iOiItGgn6u4+faUCdgGEV\\nEnmG69//3lAZHnEQN9rkZS3/20zc41mTJnO7dslJbB316vWUSIwYcVY/VC9DTbk+\\nMHWZd94p5hOB8PoY2vEGA53KiyWLqQC5FWE3u7cz7eYTr9/eRPDTc15IzohLXd5U\\nC9EbO5ebho2CvWrBfrLozM5Kidp8r3Jp+A0o3kfJ/kRDDn/BmG6pM0TohWZFYMs2\\nnQaGg+of9tcafgAs7hZAgBrrcc/jke6+MKxpC8algik79nMk7s7prxF1Z9EbAeQV\\n1ssL2VgsjvGAHIV+Arckl6QJbVDvQXNAM0PqbQIDAQABAoIBAQCoG6D5vf5P8nMS\\n2ltB/6cyyfsjgO/45Y+mTXqERwj0DOwUeMkDyRv6KCxb8LxKade+FPIaG7D/7amw\\nfdcE7qrRUyD3YfnPbUk5oNcfAwFbg+BX969WWBMZmgvfDGj1fWKT4w9ScQ1YkFUD\\nKrkLzLVhK+/N0Dad0VjiguTXTMZCSDFOY9fO8HRF6EA3aewEPeEY62J6rSjGXvWB\\nGdW+FNvf/uRr36xGHNqiOP837pdVUppjgDyVsORnMfFtYMyWyxS2XD5r8gRwcRg7\\n0nz6bLM53DjKweO+Yl+pIVPFAyXL0pwzQDlnjShsCzyzjA9lJftkQwbcMWopeegJ\\nkPLmiq4VAoGBAOqDmySNx8vmWWMOaXKFuH6Gqu/Nd7gBHxZ73wvsEmvV52xwa0oi\\n55h+v6P1YEaNZQWXDFsvILoOUHr2kwZY+Du/MC7tgqpj+Fu3h7UHslulJRE3A+sN\\noLbHjZuwm3wwsatpHdyEYOGg0HIGWXi+9pDT/1gy8g3L2Gf0X6rfkBBXAoGBAN2v\\nlbii0+HvZ2y0D0P6NfUJ6cQDrSyuTe7UW6OVYjBjrVAk8+bhnQ4eKd9edCnUDqu6\\n9C8ZSrqR6VBeItbt8y+5ZCRcrigxd2VdH8rL9g6idD9RPnSbHx7Al8DxSUv25xMK\\n8Z/ZOAvuCmwDfdleycNDoTawKqLtWBzUEntLs5DbAoGAPlTKiJWylAxel8h92HWY\\nSvDqQCChgGOz6prz9sxBPS42e4kJy0OpwMt3jlGqzDXKswipvRayoSEq3PPqshY1\\nrFOtr9trDnTRzzbhuAkaq+ciCghQX0pY/BvgFJCFUyXyIzgmOrVotq+yl4v+fexr\\nxqTCSqQH2AjlNQQr5VPUi7MCgYEAsNbbMXE6YlXug+lS8CANoM3qm4FvSGA3LNhb\\nza9hp0YsP+1qXvgEp/lp35RiR+ewWE+HcHbVhOTWYFTnp9ojDyPtfZAtIUTsgIB7\\n1vNC8kOnRccSckQ32/k4VSJlHOL1S9yECMZnjiSyTZ2va5HQkyJE3PJE4LlCe6S0\\npYQq1tcCgYEAoJDeSeAPqi5NIu+MWNUWzw4vo5raKyHrJi+cTvKyM/2zJFHvBc5f\\nRaxkcIAOmIDoVdFgy6APY/0DnDnpqT1kMagUaxZjG9PLFIDds5DRaL99m+S7l8mt\\nySX/MbmhQHYWpVf2nL6pmfPuP4Ih6tbKIUUGA3wZXYYZ5r+pZFG1IrA=\\n-----END RSA PRIVATE KEY-----`;

    const signingConfig = createJWTSigningConfig(input, "RS256");

    expect(signingConfig.algorithm).toEqual("RS256");
    expect(signingConfig.secret.toString()).toMatchSnapshot();
  });
});
