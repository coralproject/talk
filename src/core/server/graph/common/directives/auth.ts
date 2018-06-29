import { DirectiveResolverFn } from "graphql-tools";

const auth: DirectiveResolverFn = (next, src, args, context) => {
  return next().then(str => {
    if (typeof str === "string") {
      return str.toUpperCase();
    }
    return str;
  });
};

export default auth;
