import React from "react";
import { ReactNode, StatelessComponent } from "react";
import Responsive from "react-responsive";

interface InnerProps {
  minWidth?: string;
  maxWidth?: string;
  children: ReactNode;
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
}

const MatchMedia: StatelessComponent<InnerProps> = props => {
  // TODO: Temporarily map newer speech to older aural type until
  // react-responsive supports the speech prop.
  const { speech, ...rest } = props;
  return <Responsive {...rest} aural={speech} />;
};

export default MatchMedia;
