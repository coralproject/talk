import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Box, ClickOutside, Popover, Typography } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import styles from "./Tooltip.css";

interface Props {
  id: string;
  className?: string;
  title: React.ReactNode;
  body: React.ReactNode;
  button: PropTypesOf<typeof Popover>["children"];
}

export const Tooltip: FunctionComponent<Props> = ({
  id,
  className,
  title,
  body,
  button,
}) => {
  return (
    <Popover
      id={id}
      className={cn(styles.root, className)}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Box
            p={2}
            className={styles.tooltip}
            onClick={evt => {
              // Don't propagate click events when clicking inside of popover to
              // avoid accidentally activating other components.
              evt.stopPropagation();
            }}
          >
            <Typography
              color="textLight"
              variant="bodyCopyBold"
              mb={2}
              className={styles.title}
            >
              {title}
            </Typography>

            <Typography color="textLight" variant="detail">
              {body}
            </Typography>
          </Box>
        </ClickOutside>
      )}
      placement={"bottom"}
      dark
    >
      {props => button(props)}
    </Popover>
  );
};

export default Tooltip;
