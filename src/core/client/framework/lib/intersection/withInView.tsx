import * as React from "react";
import { DefaultingInferableComponentEnhancer, hoistStatics } from "recompose";

import { Observe, withIntersectionContext } from "./IntersectionContext";

interface InjectedProps {
  inView: boolean | undefined;
  intersectionRef: React.Ref<any>;
}

interface Props {
  observe: Observe;
}

interface State {
  inView: boolean | undefined;
}

/**
 * withInView provides a property `inView: boolean`
 * to indicate whether or not the referenced element is
 * in the current browser view.
 */
const withInView: DefaultingInferableComponentEnhancer<
  InjectedProps
> = hoistStatics<InjectedProps>(
  <T extends InjectedProps>(BaseComponent: React.ComponentType<T>) => {
    // TODO: (cvle) This is a workaround for a typescript bug
    // https://github.com/Microsoft/TypeScript/issues/30762
    const Workaround = BaseComponent as React.ComponentType<InjectedProps>;

    class WithInView extends React.Component<Props, State> {
      private unobserve: (() => void) | null = null;

      public state = {
        inView: undefined,
      };

      private changeRef = (ref: any) => {
        if (this.unobserve) {
          this.unobserve();
          this.unobserve = null;
        }
        if (ref) {
          this.unobserve = this.props.observe(
            ref,
            ({ intersectionRatio }: any) => {
              // Callback is called whenever we run observe.
              if (this.state.inView === undefined) {
                this.setState({ inView: intersectionRatio > 0 });
              } else {
                this.setState(s => ({
                  inView: !s.inView,
                }));
              }
            }
          );
        }
      };

      public componentWillUnmount() {
        if (this.unobserve) {
          this.unobserve();
        }
      }

      public render() {
        return (
          <Workaround
            {...this.props}
            inView={this.state.inView}
            intersectionRef={this.changeRef}
          />
        );
      }
    }

    const enhanced = withIntersectionContext(({ observe }) => ({ observe }))(
      WithInView
    );
    return enhanced as React.ComponentType<any>;
  }
);

export default withInView;
