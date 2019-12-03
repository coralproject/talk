import isPromiseLike from "./isPromiseLike";

export default function isPromise(obj: any): obj is Promise<any> {
  return isPromiseLike(obj) && typeof obj.then === "function";
}
