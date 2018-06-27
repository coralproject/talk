import * as React from "react";
import { compose, hoistStatics, InferableComponentEnhancer } from "recompose";
import { CSelector, CSnapshot, Environment } from "relay-runtime";

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
function withLocalStateContainer<T>(
  fragmentSpec: any
): InferableComponentEnhancer<{ local: T }> {
  return compose(
    withContext(({ relayEnvironment }) => ({ relayEnvironment })),
    hoistStatics((WrappedComponent: React.ComponentType<any>) => {
      class LocalStateContainer extends React.Component<Props, any> {
        constructor(props: Props) {
          super(props);
          const fragment = fragmentSpec.data().default;
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
          const snapshot = props.relayEnvironment.lookup(selector);
          props.relayEnvironment.subscribe(snapshot, this.updateSnapshot);
          this.state = {
            data: snapshot.data,
          };
        }

        private updateSnapshot = (snapshot: CSnapshot<any>) => {
          this.setState({ data: snapshot.data });
        };

        public render() {
          const { relayEnvironment: _, ...rest } = this.props;
          return <WrappedComponent {...rest} local={this.state.data} />;
        }
      }
      return LocalStateContainer as React.ComponentType<any>;
    })
  );
}

export default withLocalStateContainer;
