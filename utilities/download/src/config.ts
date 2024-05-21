import fs from "fs";

export class Config {
  private filePath: string;

  public readonly mongoURI: string;
  public readonly mongoDBName: string;
  public readonly outputDir: string;
  public readonly tenantIDs: string[];

  constructor(filePath: string) {
    this.filePath = filePath;

    const raw = fs.readFileSync(this.filePath).toString();
    const json = JSON.parse(raw);

    this.mongoURI =
      json.mongoURI && typeof json.mongoURI === "string"
        ? json.mongoURI
        : "mongodb://localhost:27017";
    this.mongoDBName =
      json.mongoDBName && typeof json.mongoDBName === "string"
        ? json.mongoDBName
        : "coral";

    this.outputDir =
      json.outputDir && typeof json.outputDir === "string"
        ? json.outputDir
        : "output/";

    this.tenantIDs =
      json.tenantIDs &&
      Array.isArray(json.tenantIDs) &&
      json.tenantIDs.length > 0
        ? json.tenantIDs
        : [];
  }
}
