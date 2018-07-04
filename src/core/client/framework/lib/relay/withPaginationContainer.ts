import {
  ConnectionConfig as OrigConnectionConfig,
  createPaginationContainer,
  GraphQLTaggedNode,
  PageInfo,
  RelayPaginationProp,
} from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";
import { Overwrite } from "talk-framework/types";

// TODO: (cvle) Fix this type definition upstream.
interface ConnectionData {
  edges?: Readonly<any>;
  pageInfo?: PageInfo;
}

type ConnectionConfig<T> = Overwrite<
  OrigConnectionConfig<T>,
  { getConnectionFromProps?(props: T): ConnectionData | undefined | null }
>;

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
