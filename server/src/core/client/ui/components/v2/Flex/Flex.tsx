import cn from "classnames";
import React, { FunctionComponent, Ref } from "react";

import { pascalCase } from "coral-common/utils";
import { withForwardRef, withStyles } from "coral-ui/hocs";
import { Spacing } from "coral-ui/theme/sharedVariables";
import { PropTypesOf } from "coral-ui/types";

/** Needs to be loaded after styles, because Box styles have priority */
import Box from "../Box";

import styles from "./Flex.css";

interface Props extends Omit<PropTypesOf<typeof Box>, "ref"> {
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
  /** @deprecated use `spacing` instead */
  itemGutter?: boolean | "half" | "double" | "triple";
  /** Adds a gutter between items. Uses predefined sizes from design tokens */
  spacing?: Spacing;
  className?: string;
  wrap?: boolean | "reverse";

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLDivElement>;
}

const Flex: FunctionComponent<Props> = (props) => {
  const {
    classes,
    className,
    justifyContent,
    alignItems,
    direction,
    itemGutter,
    wrap,
    forwardRef,
    children,
    spacing,
    ...rest
  } = props;

  const classObject: Record<string, boolean> = {
    [classes.itemGutter]: itemGutter === true,
    [classes.halfItemGutter]: itemGutter === "half",
    [classes.doubleItemGutter]: itemGutter === "double",
    [classes.tripleItemGutter]: itemGutter === "triple",
    [classes.wrap]: wrap === true,
    [classes.wrapReverse]: wrap === "reverse",
  };

  if (justifyContent) {
    classObject[(classes as any)[`justify${pascalCase(justifyContent)}`]] =
      true;
  }

  if (alignItems) {
    classObject[(classes as any)[`align${pascalCase(alignItems)}`]] = true;
  }

  if (direction) {
    classObject[(classes as any)[`direction${pascalCase(direction)}`]] = true;
  }

  const rootClassNames: string = cn(classes.root, className);
  const flexClassNames: string = cn(
    classes.flex,
    classObject,
    (itemGutter || spacing) && "gutter",
    spacing && (classes as any)[`spacing-${spacing}`]
  );

  // text nodes can't be modified with css, so replace them with spans.
  // Readd spaces at the beginning or end of text nodes because
  // flex removes it.
  const content = React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return <span>{child.replace(/^ +| +$/g, "\xa0")}</span>;
    }
    return child;
  });

  if (wrap && itemGutter) {
    // The first div is required to support nested `Flex` components with itemGutters.
    return (
      <Box ref={forwardRef} className={rootClassNames} {...rest}>
        <div className={flexClassNames}>{content}</div>
      </Box>
    );
  }
  return (
    <Box
      ref={forwardRef}
      className={cn(rootClassNames, flexClassNames)}
      {...rest}
    >
      {content}
    </Box>
  );
};

const enhanced = withForwardRef(withStyles(styles)(Flex));
export default enhanced;
export type FlexProps = PropTypesOf<typeof enhanced>;
