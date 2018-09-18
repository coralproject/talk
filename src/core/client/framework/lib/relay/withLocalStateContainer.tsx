import * as React from "react";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import {
  CSelector,
  CSnapshot,
  Disposable,
  Environment,
  GraphQLTaggedNode,
} from "relay-runtime";

import { _RefType } from "react-relay";
import { withContext } from "../bootstrap";

interface Props {
  relayEnvironment: Environment;
}

/**
 * The Root Record of Client-Side Schema Extension must be of this type.
 */
export const LOCAL_TYPE = "Local";

/**
 * The Root Record of Client-Side Schema Extension must have this id.
 */
export const LOCAL_ID = "client:root.local";

/**
 * withLocalStateContainer allows for subscribing to local state
 * that has been added using Client-Side Schema Extensions.
 * The `fragmentSpec` must be a `Fragment` on the `LOCAL_TYPE` which
 * must have the `LOCAL_ID`.
 */
function withLocalStateContainer(
  fragmentSpec: GraphQLTaggedNode
): InferableComponentEnhancer<{ local: _RefType<any> }> {
  const fragment = (fragmentSpec as any).data().default;
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
          const selector: CSelector<any> = {
            dataID: LOCAL_ID,
            node: { selections: fragment.selections },
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

        private updateSnapshot = (snapshot: CSnapshot<any>) => {
          const nextState = { data: snapshot.data };
          // State has not been initialized yet.
          if (!this.state) {
            this.state = nextState;
            return;
          }
          this.setState(nextState);
        };

        private unsubscribe() {
          this.subscription.dispose();
        }

        public componentWillReceiveProps(next: Props) {
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
      return LocalStateContainer as React.ComponentType<any>;
    })
  );
}

export default withLocalStateContainer;
