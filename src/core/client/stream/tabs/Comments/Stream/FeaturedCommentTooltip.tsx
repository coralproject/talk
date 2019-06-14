import cn from "classnames";
import React, { FunctionComponent } from "react";

import {
  BaseButton,
  Box,
  ClickOutside,
  Icon,
  Popover,
  Typography,
} from "coral-ui/components";

import { Localized } from "fluent-react/compat";
import styles from "./FeaturedCommentTooltip.css";

interface Props {
  className?: string;
  active?: boolean;
}

export const FeaturedCommentTooltip: FunctionComponent<Props> = props => {
  return (
    <Popover
      id="comments-featuredCommentPopover"
      className={cn(styles.root, props.className)}
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Box
            p={2}
            className={styles.tooltip}
            onClick={evt => {
              // Don't propagate click events when clicking inside of popover to
              // avoid accidently activating the featured comments tab.
              evt.stopPropagation();
            }}
          >
            <Localized id="comments-featuredCommentTooltip-how">
              <Typography
                color="textLight"
                variant="bodyCopyBold"
                mb={2}
                className={styles.title}
              >
                How is a comment featured?
              </Typography>
            </Localized>
            <Localized id="comments-featuredCommentTooltip-handSelectedComments">
              <Typography color="textLight" variant="detail">
                Comments are hand selected by our team as worth reading.
              </Typography>
            </Localized>
          </Box>
        </ClickOutside>
      )}
      placement={"bottom"}
      dark
    >
      {({ toggleVisibility, ref }) => (
        <Localized
          id="comments-featuredCommentTooltip-toggleButton"
          attrs={{ "aria-label": true }}
        >
          <BaseButton
            className={styles.button}
            onClick={evt => {
              evt.stopPropagation();
              toggleVisibility();
            }}
            aria-label="Toggle featured comments tooltip"
            ref={ref}
          >
            <Icon color={props.active ? "primary" : "inherit"}>info</Icon>
          </BaseButton>
        </Localized>
      )}
    </Popover>
  );
};

export default FeaturedCommentTooltip;
