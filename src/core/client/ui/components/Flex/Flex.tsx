import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { pascalCase } from "talk-common/utils";

import * as styles from "./Flex.css";

interface InnerProps {
  id?: string;
  role?: string;
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-around"
    | "space-between"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  itemGutter?: boolean | "half";
  className?: string;
  wrap?: boolean | "reverse";
}

const Flex: StatelessComponent<InnerProps> = props => {
  const {
    className,
    justifyContent,
    alignItems,
    direction,
    itemGutter,
    wrap,
    ...rest
  } = props;

  const classObject: Record<string, boolean> = {
    [styles.itemGutter]: itemGutter === true,
    [styles.halfItemGutter]: itemGutter === "half",
    [styles.wrap]: wrap === true,
    [styles.wrapReverse]: wrap === "reverse",
  };

  if (justifyContent) {
    classObject[(styles as any)[`justify${pascalCase(justifyContent)}`]] = true;
  }

  if (alignItems) {
    classObject[(styles as any)[`align${pascalCase(alignItems)}`]] = true;
  }

  if (direction) {
    classObject[(styles as any)[`direction${pascalCase(direction)}`]] = true;
  }

  const classNames: string = cn(styles.root, className, classObject);

  return <div className={classNames} {...rest} />;
};

export default Flex;
