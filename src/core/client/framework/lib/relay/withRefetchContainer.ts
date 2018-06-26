import {
  createRefetchContainer,
  GraphQLTaggedNode,
  RelayRefetchProp,
} from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";

/**
 * withRefetchContainer is a curried version of `createRefetchContainers`
 * from Relay.
 */
export default <T>(
  fragmentSpec: GraphQLTaggedNode,
  refetchQuery: GraphQLTaggedNode
): InferableComponentEnhancerWithProps<
  T & { relay: RelayRefetchProp },
  { [P in keyof T]: any }
> => (component: React.ComponentType<any>) =>
  createRefetchContainer(component, fragmentSpec, refetchQuery) as any;
