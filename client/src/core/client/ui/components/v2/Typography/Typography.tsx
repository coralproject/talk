import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

/** Needs to be loaded after styles, because Box styles have priority */
import { Box } from "coral-ui/components/v2";
import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

/* In this case the Box styles have higher priority! */
import styles from "./Typography.css";

type Variant =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "header1"
  | "header2"
  | "header3"
  | "header4"
  | "header5"
  | "bodyCopy"
  | "bodyCopyBold"
  | "bodyShort"
  | "fieldDescription"
  | "inputLabel"
  | "detail"
  | "timestamp"
  // V2
  | "bodyCommentV2";

// Based on Typography Component of Material UI.
// https://github.com/mui-org/material-ui/blob/303199d39b42a321d28347d8440d69166f872f27/packages/material-ui/src/Typography/Typography.js

interface Props extends Omit<PropTypesOf<typeof Box>, "ref"> {
  /**
   * Set the text-align on the component.
   */
  align?: "inherit" | "left" | "center" | "right" | "justify";
  /**
   * The content of the component.
   */
  children?: ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color?:
    | "inherit"
    | "primary"
    | "textPrimary"
    | "textSecondary"
    | "textLight"
    | "warning"
    | "error"
    | "errorDark"
    | "textDark"
    | "success"
    // V2
    | "textPrimaryV2";
  /**
   * The container used for the root node.
   * Either a string to use a DOM element, a component, or an element.
   * By default, it maps the variant to a good default headline component.
   */
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
  /**
   * If `true`, the text will have a bottom margin.
   */
  gutterBottom?: boolean;
  /**
   * We are empirically mapping the variant property to a range of different DOM element types.
   * For instance, h1 to h6. If you wish to change that mapping, you can provide your own.
   * Alternatively, you can use the `component` property.
   */
  headlineMapping?: { [P in Variant]?: React.ComponentType<any> | string };
  /**
   * If `true`, the text will not wrap, but instead will truncate with an ellipsis.
   */
  noWrap?: boolean;
  /**
   * If `true`, the text will have a bottom margin.
   */
  paragraph?: boolean;
  /**
   * Applies the theme typography styles.
   */
  variant?: Variant;

  /** Internal: Forwarded Ref */
  forwardRef?: PropTypesOf<typeof Box>["ref"];
}

const Typography: FunctionComponent<Props> = (props) => {
  const {
    align,
    classes,
    className,
    color,
    container,
    gutterBottom,
    headlineMapping,
    noWrap,
    paragraph,
    variant,
    forwardRef,
    ...rest
  } = props;

  const rootClassName = cn(
    classes.root,
    classes[variant!],
    {
      [classes.colorTextPrimary]: color === "textPrimary",
      [classes.colorTextSecondary]: color === "textSecondary",
      [classes.colorTextLight]: color === "textLight",
      [classes.colorPrimary]: color === "primary",
      [classes.colorTextDark]: color === "textDark",
      [classes.colorError]: color === "error",
      [classes.colorErrorDark]: color === "errorDark",
      [classes.colorSuccess]: color === "success",
      [classes.colorWarning]: color === "warning",
      [classes.noWrap]: noWrap,
      [classes.gutterBottom]: gutterBottom,
      [classes.paragraph]: paragraph,
      [classes.alignLeft]: align === "left",
      [classes.alignCenter]: align === "center",
      [classes.alignRight]: align === "right",
      [classes.alignJustify]: align === "justify",
    },
    className
  );

  const Container =
    container || (paragraph ? "p" : headlineMapping![variant!]) || "span";

  const innerProps = {
    ref: forwardRef,
    className: rootClassName,
    container: Container,
    ...rest,
  };

  return <Box {...innerProps} />;
};

Typography.defaultProps = {
  align: "inherit",
  color: "textPrimary",
  gutterBottom: false,
  headlineMapping: {
    heading1: "h1",
    heading2: "h1",
    heading3: "h1",
    heading4: "h1",
    heading5: "h1",
    header1: "h1",
    header2: "h1",
    header3: "h1",
    header4: "h1",
    header5: "h1",
    bodyCopy: "p",
    bodyCopyBold: "p",
    bodyShort: "p",
    fieldDescription: "p",
    timestamp: "span",
    inputLabel: "label",
    detail: "p",
    // V2
    bodyCommentV2: "p",
  },
  noWrap: false,
  paragraph: false,
  variant: "bodyCopy",
} as Partial<Props>;

const enhanced = withForwardRef(withStyles(styles)(Typography));
export type TypographyProps = PropTypesOf<typeof enhanced>;
export default enhanced;
