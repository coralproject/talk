import React from "react";
import { _RefType } from "react-relay";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import {
  Disposable,
  Environment,
  GraphQLTaggedNode,
  ReaderFragment,
  SingularReaderSelector,
  Snapshot,
} from "relay-runtime";

import withContext from "../bootstrap/withContext";
import { resolveModule } from "./helpers";
import { LOCAL_ID, LOCAL_TYPE } from "./localState";

interface Props {
  relayEnvironment: Environment;
}
/**
 * withLocalStateContainer allows for subscribing to local state
 * that has been added using Client-Side Schema Extensions.
 * The `fragmentSpec` must be a `Fragment` on the `LOCAL_TYPE` which
 * must have the `LOCAL_ID`.
 *
 * @deprecated use `useLocal` instead.
 */
function withLocalStateContainer(
  fragmentSpec: GraphQLTaggedNode
): InferableComponentEnhancer<{ local: _RefType<any> }> {
  const fragment = resolveModule(fragmentSpec as ReaderFragment);
  return compose(
    withContext(({ relayEnvironment }) => ({ relayEnvironment })),
    hoistStatics((BaseComponent: React.ComponentType<any>) => {
      class LocalStateContainer extends React.Component<Props, any> {
        public static displayName = wrapDisplayName(
          BaseComponent,
          "withLocalStateContainer"
        );
        private subscription: Disposable;

        private subscribe(environment: Environment) {
          if (fragment.kind !== "Fragment") {
            throw new Error("Expected fragment");
          }
          if (fragment.type !== LOCAL_TYPE) {
            throw new Error(
              `Type must be "Local" in "Fragment ${fragment.name}"`
            );
          }
          // TODO: (cvle) This is part is still hacky.
          // Waiting for a solution to https://github.com/facebook/relay/issues/2997.
          const selector: SingularReaderSelector = {
            kind: undefined as any,
            owner: undefined as any,
            dataID: LOCAL_ID,
            node: {
              type: fragment.type,
              kind: fragment.kind,
              name: fragment.name,
              metadata: fragment.metadata,
              selections: fragment.selections,
              argumentDefinitions: [],
            },
            variables: {},
          };
          const snapshot = environment.lookup(selector);
          this.subscription = environment.subscribe(
            snapshot,
            this.updateSnapshot
          );
          this.updateSnapshot(snapshot);
        }

        constructor(props: Props) {
          super(props);
          this.subscribe(props.relayEnvironment);
        }

        private updateSnapshot = (snapshot: Snapshot) => {
          const nextState = { data: snapshot.data };
          // State has not been initialized yet.
          if (!this.state) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state = nextState;
            return;
          }
          this.setState(nextState);
        };

        private unsubscribe() {
          this.subscription.dispose();
        }

        public UNSAFE_componentWillReceiveProps(next: Props) {
          if (this.props.relayEnvironment !== next.relayEnvironment) {
            this.unsubscribe();
            this.subscribe(next.relayEnvironment);
          }
        }

        public componentWillUnmount() {
          this.unsubscribe();
        }

        public render() {
          const { relayEnvironment: _, ...rest } = this.props;
          return <BaseComponent {...rest} local={this.state.data} />;
        }
      }
      return LocalStateContainer as React.ComponentClass<any>;
    })
  ) as any;
}

export default withLocalStateContainer;
