import sinon from "sinon";

import { Config } from "talk-common/config";
import {
  createJWTSigningConfig,
  extractJWTFromRequest,
  parseAuthHeader,
} from "talk-server/app/middleware/passport/jwt";
import { Request } from "talk-server/types/express";

describe("parseAuthHeader", () => {
  it("parses valid headers", () => {
    const parsed = {
      scheme: "bearer",
      value: "token",
    };

    expect(parseAuthHeader("Bearer token")).toEqual(parsed);

    expect(parseAuthHeader("bearer token")).toEqual(parsed);

    expect(parseAuthHeader("bearer  token")).toEqual(parsed);
  });

  it("parses invalid headers", () => {
    expect(parseAuthHeader("this-is-a-wrong-header")).toEqual(null);
    expect(parseAuthHeader("bearerthis-is-a-wrong-header")).toEqual(null);
  });
});

describe("extractJWTFromRequest", () => {
  it("extracts the token from header", () => {
    const req = {
      get: sinon
        .stub()
        .withArgs("authorization")
        .returns("Bearer token"),
    };

    expect(extractJWTFromRequest((req as any) as Request)).toEqual("token");
    expect(req.get.calledOnce).toBeTruthy();

    req.get.reset();
    req.get.returns(null);
    expect(extractJWTFromRequest((req as any) as Request)).toEqual(null);
    expect(req.get.calledOnce).toBeTruthy();
  });

  it("extracts the token from query string", () => {
    const req = {
      get: sinon
        .stub()
        .withArgs("authorization")
        .returns(null),
      query: { access_token: "token" },
    };

    expect(extractJWTFromRequest((req as any) as Request)).toEqual("token");
    expect(req.get.calledOnce).toBeTruthy();

    delete req.query.access_token;

    req.get.reset();
    expect(extractJWTFromRequest((req as any) as Request)).toEqual(null);
    expect(req.get.calledOnce).toBeTruthy();
  });
});

describe("createJWTSigningConfig", () => {
  it("parses a RSA certificate", () => {
    const input = `-----BEGIN RSA PRIVATE KEY-----\\nMIIEpQIBAAKCAQEAyxR2DVlvkQRquggUQTpHN+PxDs2iOiItGgn6u4+faUCdgGEV\\nEnmG69//3lAZHnEQN9rkZS3/20zc41mTJnO7dslJbB316vWUSIwYcVY/VC9DTbk+\\nMHWZd94p5hOB8PoY2vEGA53KiyWLqQC5FWE3u7cz7eYTr9/eRPDTc15IzohLXd5U\\nC9EbO5ebho2CvWrBfrLozM5Kidp8r3Jp+A0o3kfJ/kRDDn/BmG6pM0TohWZFYMs2\\nnQaGg+of9tcafgAs7hZAgBrrcc/jke6+MKxpC8algik79nMk7s7prxF1Z9EbAeQV\\n1ssL2VgsjvGAHIV+Arckl6QJbVDvQXNAM0PqbQIDAQABAoIBAQCoG6D5vf5P8nMS\\n2ltB/6cyyfsjgO/45Y+mTXqERwj0DOwUeMkDyRv6KCxb8LxKade+FPIaG7D/7amw\\nfdcE7qrRUyD3YfnPbUk5oNcfAwFbg+BX969WWBMZmgvfDGj1fWKT4w9ScQ1YkFUD\\nKrkLzLVhK+/N0Dad0VjiguTXTMZCSDFOY9fO8HRF6EA3aewEPeEY62J6rSjGXvWB\\nGdW+FNvf/uRr36xGHNqiOP837pdVUppjgDyVsORnMfFtYMyWyxS2XD5r8gRwcRg7\\n0nz6bLM53DjKweO+Yl+pIVPFAyXL0pwzQDlnjShsCzyzjA9lJftkQwbcMWopeegJ\\nkPLmiq4VAoGBAOqDmySNx8vmWWMOaXKFuH6Gqu/Nd7gBHxZ73wvsEmvV52xwa0oi\\n55h+v6P1YEaNZQWXDFsvILoOUHr2kwZY+Du/MC7tgqpj+Fu3h7UHslulJRE3A+sN\\noLbHjZuwm3wwsatpHdyEYOGg0HIGWXi+9pDT/1gy8g3L2Gf0X6rfkBBXAoGBAN2v\\nlbii0+HvZ2y0D0P6NfUJ6cQDrSyuTe7UW6OVYjBjrVAk8+bhnQ4eKd9edCnUDqu6\\n9C8ZSrqR6VBeItbt8y+5ZCRcrigxd2VdH8rL9g6idD9RPnSbHx7Al8DxSUv25xMK\\n8Z/ZOAvuCmwDfdleycNDoTawKqLtWBzUEntLs5DbAoGAPlTKiJWylAxel8h92HWY\\nSvDqQCChgGOz6prz9sxBPS42e4kJy0OpwMt3jlGqzDXKswipvRayoSEq3PPqshY1\\nrFOtr9trDnTRzzbhuAkaq+ciCghQX0pY/BvgFJCFUyXyIzgmOrVotq+yl4v+fexr\\nxqTCSqQH2AjlNQQr5VPUi7MCgYEAsNbbMXE6YlXug+lS8CANoM3qm4FvSGA3LNhb\\nza9hp0YsP+1qXvgEp/lp35RiR+ewWE+HcHbVhOTWYFTnp9ojDyPtfZAtIUTsgIB7\\n1vNC8kOnRccSckQ32/k4VSJlHOL1S9yECMZnjiSyTZ2va5HQkyJE3PJE4LlCe6S0\\npYQq1tcCgYEAoJDeSeAPqi5NIu+MWNUWzw4vo5raKyHrJi+cTvKyM/2zJFHvBc5f\\nRaxkcIAOmIDoVdFgy6APY/0DnDnpqT1kMagUaxZjG9PLFIDds5DRaL99m+S7l8mt\\nySX/MbmhQHYWpVf2nL6pmfPuP4Ih6tbKIUUGA3wZXYYZ5r+pZFG1IrA=\\n-----END RSA PRIVATE KEY-----`;
    const config = {
      get: sinon.stub(),
    };

    config.get.withArgs("signing_secret").returns(input);
    config.get.withArgs("signing_algorithm").returns("RS256");

    const signingConfig = createJWTSigningConfig((config as any) as Config);

    expect(signingConfig.algorithm).toEqual("RS256");
    expect(signingConfig.secret.toString()).toMatchSnapshot();
  });
});
