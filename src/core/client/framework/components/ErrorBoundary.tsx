import React from "react";
import { InferableComponentEnhancer, nest, withProps } from "recompose";

import { globalErrorReporter } from "coral-framework/lib/errors";

interface Props {
  errorContent?: React.ReactNode;
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true });
    globalErrorReporter.report(error, { componentStack: info.componentStack });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.errorContent !== undefined) {
        return this.props.errorContent;
      }
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export const withErrorBoundary =
  (
    props: { errorContent?: React.ReactNode } = {}
  ): InferableComponentEnhancer<{}> =>
  (component: React.ComponentType<any>) => {
    return nest(withProps<any, any>(props)(ErrorBoundary), component) as any;
  };

export default ErrorBoundary;
