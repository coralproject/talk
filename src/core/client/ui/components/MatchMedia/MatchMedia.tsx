import React from "react";
import { ReactNode, StatelessComponent } from "react";
import Responsive, { MediaQueryMatchers } from "react-responsive";

import { PropTypesOf } from "talk-ui/types";

import theme from "../../theme/variables";
import UIContext from "../UIContext";

type Breakpoints = keyof typeof theme.breakpoints;

interface Props {
  /** greater than or equal width. */
  gteWidth?: Breakpoints;

  /** greater than width. */
  gtWidth?: Breakpoints;

  /** less than equals width. */
  lteWidth?: Breakpoints;

  /** less than equals width. */
  ltWidth?: Breakpoints;
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

export const MatchMedia: StatelessComponent<Props> = props => {
  const { speech, gteWidth, gtWidth, lteWidth, ltWidth, ...rest } = props;
  const mapped = {
    // TODO: Temporarily map newer speech to older aural type until
    // react-responsive supports the speech prop.
    aural: speech,
    minWidth: gtWidth
      ? theme.breakpoints[gtWidth] + 1
      : gteWidth
      ? theme.breakpoints[gteWidth]
      : undefined,
    maxWidth: ltWidth
      ? theme.breakpoints[ltWidth] - 1
      : lteWidth
      ? theme.breakpoints[lteWidth]
      : undefined,
  };
  return <Responsive {...rest} {...mapped} />;
};

const MatchMediaWithContext: StatelessComponent<Props> = props => (
  <UIContext.Consumer>
    {({ mediaQueryValues }) => (
      <MatchMedia {...props} values={mediaQueryValues} />
    )}
  </UIContext.Consumer>
);

export default MatchMediaWithContext;
export type MatchMediaProps = PropTypesOf<typeof MatchMediaWithContext>;
