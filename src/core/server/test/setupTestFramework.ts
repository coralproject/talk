// Jest does not share modules between testsuites and as such
// would cause many loggers to be created, which would cause a warning.
// Increase max listeners to avoid the warning.
process.stdout.setMaxListeners(1000);
