declare module "dotize" {
  export = dotize;

  function dotize(obj: any): { [_: string]: any };
}
