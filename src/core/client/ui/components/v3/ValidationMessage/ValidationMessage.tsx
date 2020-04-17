import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { FieldMeta, hasError } from "coral-framework/lib/form";
import { Flex, Icon } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./ValidationMessage.css";

interface Props {
  children?: ReactNode;
  variant?: "text" | "none";
  classes: typeof styles;
  className?: string;
  meta?: FieldMeta;
}

const render = (content: any, classes: typeof styles, className?: string) => {
  const rootClassName = cn(classes.root, className);

  return (
    <div className={rootClassName}>
      <Flex alignItems="center">
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
}) => {
  if (children) {
    return render(children, classes, className);
  }

  if (meta && hasError(meta)) {
    return render(meta.error || meta.submitError, classes, className);
  }

  return null;
};

const enhanced = withStyles(styles)(ValidationMessage);

export default enhanced;
