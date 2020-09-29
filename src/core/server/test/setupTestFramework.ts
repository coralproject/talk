import "reflect-metadata";

import { container } from "tsyringe";

import { Config, CONFIG, createConfig } from "coral-server/config";

container.register<Config>(CONFIG, { useValue: createConfig() });

// Jest does not share modules between testsuites and as such
// would cause many loggers to be created, which would cause a warning.
// Increase max listeners to avoid the warning.
process.stdout.setMaxListeners(1000);
