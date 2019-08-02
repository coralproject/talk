import React from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

import { CoralContext, withContext } from "../bootstrap";
import getMessage from "./getMessage";

export type GetMessage = <T>(id: string, defaultTo: string, args?: T) => string;

interface InjectedProps {
  getMessage: GetMessage;
}

interface Props {
  localeBundles: CoralContext["localeBundles"];
}

interface InjectedProps {
  getMessage: GetMessage;
}

interface Props {
  localeBundles: CoralContext["localeBundles"];
}

/**
 * withGetMessage provides a property `getMessage: (id: string) => string`
 * that'll provide a translated string associated with `id`.
 */
const withGetMessage: DefaultingInferableComponentEnhancer<
  InjectedProps
> = hoistStatics<InjectedProps>(
  <T extends InjectedProps>(BaseComponent: React.ComponentType<T>) => {
    // TODO: (cvle) This is a workaround for a typescript bug
    // https://github.com/Microsoft/TypeScript/issues/30762
    const Workaround = BaseComponent as React.ComponentType<InjectedProps>;

    class WithGetMessage extends React.Component<Props> {
      private getMessage = <U extends {}>(
        id: string,
        defaultTo: string,
        args?: U
      ): string => {
        return getMessage(this.props.localeBundles, id, defaultTo, args);
      };
      public render() {
        const { localeBundles: _, ...rest } = this.props;
        return <Workaround {...rest} getMessage={this.getMessage} />;
      }
    }

    const enhanced = withContext(({ localeBundles }) => ({ localeBundles }))(
      WithGetMessage
    );
    return enhanced as React.ComponentType<any>;
  }
);

export default withGetMessage;
