export interface CountQueryArgs {
  id?: string;
  url?: string;
  notext?: boolean;
}

export function createCountQueryRef(args: CountQueryArgs) {
  return btoa(`${JSON.stringify(!!args.notext)};${args.id || args.url}`);
}
