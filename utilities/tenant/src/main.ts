import { argv } from "process";
import { ArgumentDefinition, ArgumentValueType, getArgs } from "./args";
import { createMongo } from "./mongo";
import { createTenant } from "./createTenant";

const argumentDefinitions: ArgumentDefinition[] = [
  {
    shortName: "-M",
    fullName: "--mongoURI",
    valueType: ArgumentValueType.String
  },
  {
    shortName: "-DB",
    fullName: "--mongoDBName",
    valueType: ArgumentValueType.String
  },
  {
    shortName: "ct",
    fullName: "createTenant",
    valueType: ArgumentValueType.Command
  }
];

const run = async () => {
  const result = getArgs(argv, argumentDefinitions);
  
  const mongoURIItem = result.args.find((a) => a.definition.fullName === "--mongoURI");
  const mongoDBNameItem = result.args.find((a) => a.definition.fullName === "--mongoDBName");

  if (!mongoURIItem || !mongoDBNameItem) {
    console.log("mongoURI and mongoDBName are required arguments");
    process.exit();
  }

  const { db } = await createMongo(mongoURIItem.value, mongoDBNameItem.value);

  const command = result.args.find((a) => a.definition.valueType === ArgumentValueType.Command);
  if (!command) {
    console.log("no command found, exiting...");
    process.exit();
  }

  if (command.definition.fullName === "createTenant") {
    await createTenant(db);
  }

  process.exit();
}

void run();