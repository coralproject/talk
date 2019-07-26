import * as React from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

import { CoralContext, withContext } from "../bootstrap";
import format from "./format";

export type Format = (message: string, args?: object) => string;

interface Props {
  localeBundles: CoralContext["localeBundles"];
}

interface InjectedProps {
  format: Format;
}

interface Props {
  localeBundles: CoralContext["localeBundles"];
}

/**
 * withFormat provides a property `format: (id: string, args?: object) => string`
 * that'll provide a translated string associated with `id`, passing in `args`.
 */
const withFormat: DefaultingInferableComponentEnhancer<
  InjectedProps
> = hoistStatics<InjectedProps>(
  <T extends InjectedProps>(BaseComponent: React.ComponentType<T>) => {
    // TODO: (cvle) This is a workaround for a typescript bug
    // https://github.com/Microsoft/TypeScript/issues/30762
    const Workaround = BaseComponent as React.ComponentType<InjectedProps>;

    class WithFormat extends React.Component<Props> {
      public format = (message: string, args?: object) => {
        return format(this.props.localeBundles, message, args);
      };
      public render() {
        const { localeBundles: _, ...rest } = this.props;
        return <Workaround {...rest} format={this.format} />;
      }
    }

    const enhanced = withContext(({ localeBundles }) => ({ localeBundles }))(
      WithFormat
    );
    return enhanced as React.ComponentType<any>;
  }
);

export default withFormat;
