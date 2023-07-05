import { Db } from "mongodb";

export function createCollection<T>(name: string) {
  return <U = T>(mongo: Db) => {
    return mongo.collection<Readonly<U>>(name);
  };
}
