import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { pascalCase } from "talk-common/utils";

import * as styles from "./Flex.css";

interface InnerProps {
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-around"
    | "space-between"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
}

const Flex: StatelessComponent<InnerProps> = props => {
  const { justifyContent, alignItems } = props;

  const classObject: Record<string, boolean> = {};

  if (justifyContent) {
    classObject[`justify${pascalCase(justifyContent)}`] = true;
  }

  if (alignItems) {
    classObject[`align${pascalCase(alignItems)}`] = true;
  }

  const classNames: string = cn(styles.root, classObject);

  return <div className={classNames} {...props} />;
};

export default Flex;
