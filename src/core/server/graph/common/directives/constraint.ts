import {
  defaultFieldResolver,
  GraphQLArgument,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { isNumber } from "lodash";

export default class extends SchemaDirectiveVisitor {
  public visitArgumentDefinition(
    argument: GraphQLArgument,
    details: {
      field: GraphQLField<any, any>;
      objectType: GraphQLObjectType | GraphQLInterfaceType;
    }
  ) {
    const originalResolver = details.field.resolve || defaultFieldResolver;
    details.field.resolve = async (...resolveArgs) => {
      const argName = argument.name;
      const args = resolveArgs[1]; // (parent, args, context, info)
      const valueToValidate = args[argName];

      // Apply number validations.
      if (isNumber(valueToValidate)) {
        // Apply min validation.
        if (isNumber(this.args.min)) {
          if (valueToValidate < this.args.min) {
            throw new Error("too short");
          }
        }

        // Apply max validation.
        if (isNumber(this.args.max)) {
          if (valueToValidate > this.args.max) {
            throw new Error("too long");
          }
        }
      }

      return originalResolver.apply(this, resolveArgs);
    };
  }
}
