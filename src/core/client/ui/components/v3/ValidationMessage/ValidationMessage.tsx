import cn from "classnames";
import React, { FunctionComponent } from "react";

import { FieldMeta, hasError } from "coral-framework/lib/form";
import { Flex, Icon } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./ValidationMessage.css";

interface Props {
  variant?: "text" | "none";
  classes: typeof styles;
  className?: string;
  meta: FieldMeta;
}

const ValidationMessage: FunctionComponent<Props> = ({
  classes,
  className,
  meta,
}) => {
  const rootClassName = cn(classes.root, className);

  return hasError(meta) ? (
    <div className={rootClassName}>
      <Flex alignItems="center">
        <Icon size="sm" className={classes.icon}>
          error
        </Icon>
        {meta.error || meta.submitError}
      </Flex>
    </div>
  ) : null;
};

const enhanced = withStyles(styles)(ValidationMessage);

export default enhanced;
