import { Db } from "mongodb";

export default abstract class Migration {
  public readonly version: number;
  public readonly name: string;

  constructor(version: number, name: string) {
    this.version = version;
    this.name = name;
  }

  public abstract async run(mongo: Db): Promise<void>;
}
