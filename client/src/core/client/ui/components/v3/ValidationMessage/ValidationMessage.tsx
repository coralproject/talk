import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { FieldMeta, hasError } from "coral-framework/lib/form";
import { Flex, Icon } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./ValidationMessage.css";

type JustifyContent = PropTypesOf<typeof Flex>["justifyContent"];

interface Props {
  children?: ReactNode;
  variant?: "text" | "none";
  classes: typeof styles;
  className?: string;
  meta?: FieldMeta;
  justifyContent?: JustifyContent;
}

const render = (
  content: any,
  classes: typeof styles,
  className?: string,
  justifyContent?: JustifyContent
) => {
  const rootClassName = cn(classes.root, className);

  return (
    <div className={rootClassName} role="alert">
      <Flex alignItems="center" justifyContent={justifyContent}>
        <Icon size="sm" className={classes.icon}>
          error
        </Icon>
        {content}
      </Flex>
    </div>
  );
};

const ValidationMessage: FunctionComponent<Props> = ({
  classes,
  className,
  children,
  meta,
  justifyContent,
}) => {
  if (children) {
    return render(children, classes, className, justifyContent);
  }

  if (meta && hasError(meta)) {
    return render(
      meta.error || meta.submitError,
      classes,
      className,
      justifyContent
    );
  }

  return null;
};

const enhanced = withStyles(styles)(ValidationMessage);

export default enhanced;
