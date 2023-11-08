import { Db } from "mongodb";
import { Prompt } from "./prompt";

export const createTenant = async (db: Db) => {
  const prompt = new Prompt();

  const domain = await prompt.ask("what domain would you like to use for the tenant?");
  console.log(domain);
}