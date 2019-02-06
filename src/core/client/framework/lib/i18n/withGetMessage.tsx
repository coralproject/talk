import * as React from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

import { TalkContext, withContext } from "../bootstrap";
import getMessage from "./getMessage";

export type GetMessage = (id: string, defaultTo?: string) => string;

interface InjectedProps {
  getMessage: GetMessage;
}

interface Props {
  localeBundles: TalkContext["localeBundles"];
}

/**
 * withGetMessage provides a property `getMessage: (id: string) => string`
 * that'll provide a translated string associated with `id`.
 */
const withGetMessage: DefaultingInferableComponentEnhancer<
  InjectedProps
> = hoistStatics<InjectedProps>(
  <T extends InjectedProps>(BaseComponent: React.ComponentType<T>) => {
    class WithGetMessage extends React.Component<Props> {
      private getMessage = (id: string, defaultTo?: string) => {
        return getMessage(this.props.localeBundles, id, defaultTo);
      };
      public render() {
        const { localeBundles: _, ...rest } = this.props;
        return <BaseComponent {...rest} getMessage={this.getMessage} />;
      }
    }

    const enhanced = withContext(({ localeBundles }) => ({ localeBundles }))(
      WithGetMessage
    );
    return enhanced as React.ComponentType<any>;
  }
);

export default withGetMessage;
