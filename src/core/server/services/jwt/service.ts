import { inject, singleton } from "tsyringe";

import { CONFIG, Config } from "coral-server/config";

import {
  createSigningConfig,
  SigningAlgorithm,
  SigningConfig,
} from "./secrets";

@singleton()
export class JWTSigningConfigService implements SigningConfig {
  public readonly secret: string | Buffer;
  public readonly algorithm: SigningAlgorithm;

  constructor(@inject(CONFIG) config: Config) {
    const { secret, algorithm } = createSigningConfig(
      config.get("signing_secret"),
      config.get("signing_algorithm")
    );

    this.secret = secret;
    this.algorithm = algorithm;
  }
}
