import { SchemaDirectiveVisitor } from "@graphql-tools/utils";
import {
  defaultFieldResolver,
  GraphQLArgument,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from "graphql";
import { isFinite, isNumber } from "lodash";

export default class extends SchemaDirectiveVisitor {
  private validate(value: any) {
    // If the value to validate is not a number, then we can't validate it!
    if (!isNumber(value)) {
      return;
    }

    // Ensure that the value is finite.
    if (!isFinite(value)) {
      throw new Error("not finite");
    }

    // Apply min validation.
    if (isNumber(this.args.min) && value < this.args.min) {
      throw new Error("too short");
    }

    // Apply max validation.
    if (isNumber(this.args.max) && value > this.args.max) {
      throw new Error("too long");
    }
  }

  public visitArgumentDefinition(
    argument: GraphQLArgument,
    details: {
      field: GraphQLField<any, any>;
      objectType: GraphQLObjectType | GraphQLInterfaceType;
    }
  ) {
    const originalResolver = details.field.resolve || defaultFieldResolver;
    details.field.resolve = (...resolveArgs) => {
      const argName = argument.name;
      const args = resolveArgs[1]; // (parent, args, context, info)
      const valueToValidate = args[argName];

      // Validate the value.
      this.validate(valueToValidate);

      return originalResolver.apply(this, resolveArgs);
    };
  }
}
