import cn from "classnames";
import React, {
  FunctionComponent,
  HTMLAttributes,
  ReactElement,
  Ref,
} from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { Spacing } from "coral-ui/theme/sharedVariables";

import styles from "./Box.css";

interface Props extends HTMLAttributes<any> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  /* Margin */
  m?: Spacing;
  mx?: Spacing;
  my?: Spacing;
  margin?: Spacing;
  marginStart?: Spacing;
  marginEnd?: Spacing;
  marginLeft?: Spacing;
  marginRight?: Spacing;
  marginTop?: Spacing;
  marginBottom?: Spacing;
  ms?: Spacing;
  me?: Spacing;
  ml?: Spacing;
  mr?: Spacing;
  mt?: Spacing;
  mb?: Spacing;

  /* Padding */
  p?: Spacing;
  px?: Spacing;
  py?: Spacing;
  padding?: Spacing;
  paddingStart?: Spacing;
  paddingEnd?: Spacing;
  paddingLeft?: Spacing;
  paddingRight?: Spacing;
  paddingTop?: Spacing;
  paddingBottom?: Spacing;
  ps?: Spacing;
  pe?: Spacing;
  pl?: Spacing;
  pr?: Spacing;
  pt?: Spacing;
  pb?: Spacing;

  /** If set, will perform React.cloneElement instead */
  clone?: boolean;

  /** The name of the Box to render */
  children?: React.ReactNode;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLElement>;

  /**
   * The container used for the root node.
   * Either a string to use a DOM element, a component, or an element.
   */
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
}

const Box: FunctionComponent<Props> = (props) => {
  const {
    clone,
    classes,
    className,
    forwardRef,
    container,
    children,
    m,
    mx,
    my,
    margin,
    marginStart,
    marginEnd,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    ml,
    mr,
    ms,
    me,
    mt,
    mb,
    p,
    px,
    py,
    padding,
    paddingStart,
    paddingEnd,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    pl,
    pr,
    ps,
    pe,
    pt,
    pb,
    ...rest
  } = props;
  const final = {
    ml: ml || marginLeft || ms || marginStart || mx || m || margin,
    mr: mr || marginRight || me || marginEnd || mx || m || margin,
    mt: mt || marginTop || my || m || margin,
    mb: mb || marginBottom || my || m || margin,
    pl: pl || paddingLeft || ps || paddingStart || px || p || padding,
    pr: pr || paddingRight || pe || paddingEnd || px || p || padding,
    pt: pt || paddingTop || py || p || padding,
    pb: pb || paddingBottom || py || p || padding,
  };
  const rootClassName = cn(
    classes.root,
    className,
    /* Margin */
    final.ml && (classes as any)[`ml-${final.ml}`],
    final.mr && (classes as any)[`mr-${final.mr}`],
    final.mt && (classes as any)[`mt-${final.mt}`],
    final.mb && (classes as any)[`mb-${final.mb}`],
    /* Padding */
    final.pl && (classes as any)[`pl-${final.pl}`],
    final.pr && (classes as any)[`pr-${final.pr}`],
    final.pt && (classes as any)[`pt-${final.pt}`],
    final.pb && (classes as any)[`pb-${final.pb}`]
  );

  const innerProps = {
    className: rootClassName,
    ref: forwardRef,
    ...rest,
  };

  const Container = container!;

  if (clone) {
    const child = React.Children.only(children) as ReactElement;
    return React.cloneElement(child, {
      ...innerProps,
      className: cn(child.props.className, innerProps.className),
    });
  }
  if (React.isValidElement<any>(Container)) {
    return React.cloneElement(Container, { ...innerProps, children });
  } else {
    return <Container {...innerProps}>{children}</Container>;
  }
};

Box.defaultProps = {
  container: "div",
} as Partial<Props>;

const enhanced = withForwardRef(withStyles(styles)(Box));
export default enhanced;
