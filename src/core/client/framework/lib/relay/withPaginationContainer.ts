import {
  ConnectionConfig,
  createPaginationContainer,
  GraphQLTaggedNode,
  RelayPaginationProp,
} from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";

/**
 * withPaginationContainer is a curried version of `createPaginationContainers`
 * from Relay.
 */
export default <T, InnerProps>(
  fragmentSpec: { [P in keyof T]: GraphQLTaggedNode },
  connectionConfig: ConnectionConfig<InnerProps>
): InferableComponentEnhancerWithProps<
  T & { relay: RelayPaginationProp },
  { [P in keyof T]: any }
> => (component: React.ComponentType<any>) =>
  createPaginationContainer(component, fragmentSpec, connectionConfig) as any;
