import { createFragmentContainer, GraphQLTaggedNode } from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";

/**
 * withFragmentContainer is a curried version of `createFragmentContainers`
 * from Relay.
 */
export default <T>(
  fragmentSpec: GraphQLTaggedNode
): InferableComponentEnhancerWithProps<T, { [P in keyof T]: any }> => (
  component: React.ComponentType<any>
) => createFragmentContainer(component, fragmentSpec) as any;
