import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Box, ClickOutside, Popover } from "coral-ui/components/v2";
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
      placement={"bottom"}
      dark
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Box
            p={2}
            className={styles.tooltip}
            onClick={(evt) => {
              // Don't propagate click events when clicking inside of popover to
              // avoid accidentally activating other components.
              evt.stopPropagation();
            }}
          >
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.contents}>{body}</p>
          </Box>
        </ClickOutside>
      )}
    >
      {(props) => button(props)}
    </Popover>
  );
};

export default Tooltip;
