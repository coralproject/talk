import React from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

import { CoralContext, withContext } from "../bootstrap";
import format from "./format";
import getMessage from "./getMessage";

export type GetMessage = (id: string, defaultTo?: string) => string;
export type Format = (message: string, args?: object) => string;

interface InjectedProps {
  getMessage: GetMessage;
}

interface Props {
  localeBundles: CoralContext["localeBundles"];
}

interface InjectedProps {
  getMessage: GetMessage;
  format: Format;
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
      private getMessage = (id: string, defaultTo?: string) => {
        return getMessage(this.props.localeBundles, id, defaultTo);
      };
      public format = (message: string, args?: object) => {
        return format(this.props.localeBundles, message, args);
      };
      public render() {
        const { localeBundles: _, ...rest } = this.props;
        return (
          <Workaround
            {...rest}
            getMessage={this.getMessage}
            format={this.format}
          />
        );
      }
    }

    const enhanced = withContext(({ localeBundles }) => ({ localeBundles }))(
      WithGetMessage
    );
    return enhanced as React.ComponentType<any>;
  }
);

export default withGetMessage;
