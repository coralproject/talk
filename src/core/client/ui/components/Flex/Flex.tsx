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
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
}

const Flex: StatelessComponent<InnerProps> = props => {
  const { justifyContent, alignItems, direction, ...rest } = props;

  const classObject: Record<string, boolean> = {};

  if (justifyContent) {
    classObject[(styles as any)[`justify${pascalCase(justifyContent)}`]] = true;
  }

  if (alignItems) {
    classObject[(styles as any)[`align${pascalCase(alignItems)}`]] = true;
  }

  if (direction) {
    classObject[(styles as any)[`direction${pascalCase(direction)}`]] = true;
  }

  const classNames: string = cn(styles.root, classObject);

  return <div className={classNames} {...rest} />;
};

export default Flex;
