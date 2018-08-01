import React from "react";
import { ReactNode, StatelessComponent } from "react";
import Responsive, { MediaQueryMatchers } from "react-responsive";

import { PropTypesOf } from "talk-ui/types";

import theme from "../../theme/variables";
import UIContext from "../UIContext";

type Breakpoints = keyof typeof theme.breakpoints;

interface InnerProps {
  minWidth?: Breakpoints;
  maxWidth?: Breakpoints;
  children: ReactNode | ((matches: boolean) => React.ReactNode);
  className?: string;
  component?:
    | string
    | React.SFC<any>
    | React.ClassType<any, any, any>
    | React.ComponentClass<any>;
  all?: boolean;
  print?: boolean;
  screen?: boolean;
  speech?: boolean;
  values?: Partial<MediaQueryMatchers>;
}

export const MatchMedia: StatelessComponent<InnerProps> = props => {
  const { speech, minWidth, maxWidth, ...rest } = props;
  const mapped = {
    // TODO: Temporarily map newer speech to older aural type until
    // react-responsive supports the speech prop.
    aural: speech,
    minWidth: minWidth ? theme.breakpoints[minWidth] + 1 : undefined,
    maxWidth: maxWidth ? theme.breakpoints[maxWidth] : undefined,
  };
  return <Responsive {...rest} {...mapped} />;
};

const MatchMediaWithContext: StatelessComponent<InnerProps> = props => (
  <UIContext.Consumer>
    {({ mediaQueryValues }) => (
      <MatchMedia {...props} values={mediaQueryValues} />
    )}
  </UIContext.Consumer>
);

export default MatchMediaWithContext;
export type MatchMediaProps = PropTypesOf<typeof MatchMediaWithContext>;
