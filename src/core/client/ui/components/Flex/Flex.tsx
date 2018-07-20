import cn from "classnames";
import React, { Ref } from "react";
import { StatelessComponent } from "react";

import { pascalCase } from "talk-common/utils";
import { withForwardRef, withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import * as styles from "./Flex.css";

interface InnerProps {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;
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

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLDivElement>;
}

const Flex: StatelessComponent<InnerProps> = props => {
  const {
    classes,
    className,
    justifyContent,
    alignItems,
    direction,
    itemGutter,
    wrap,
    forwardRef,
    ...rest
  } = props;

  let alignItemsWithDefault = alignItems;
  if (!direction || !direction.startsWith("column")) {
    alignItemsWithDefault = "center";
  }

  const classObject: Record<string, boolean> = {
    [classes.itemGutter]: itemGutter === true,
    [classes.halfItemGutter]: itemGutter === "half",
    [classes.wrap]: wrap === true,
    [classes.wrapReverse]: wrap === "reverse",
  };

  if (justifyContent) {
    classObject[
      (classes as any)[`justify${pascalCase(justifyContent)}`]
    ] = true;
  }

  if (alignItemsWithDefault) {
    classObject[
      (classes as any)[`align${pascalCase(alignItemsWithDefault)}`]
    ] = true;
  }

  if (direction) {
    classObject[(classes as any)[`direction${pascalCase(direction)}`]] = true;
  }

  const classNames: string = cn(classes.root, className, classObject);

  return <div ref={forwardRef} className={classNames} {...rest} />;
};

const enhanced = withForwardRef(withStyles(styles)(Flex));
export default enhanced;
export type FlexProps = PropTypesOf<typeof enhanced>;
