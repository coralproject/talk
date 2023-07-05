import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Tooltip, TooltipButton } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./ExperimentalTag.css";

interface Props {
  classes: typeof styles;
  content?: React.ReactNode;
}

const ExperimentalTag: FunctionComponent<Props> = ({ classes, content }) => {
  return (
    <Flex alignItems="center">
      <div className={classes.root}>
        <Localized id="common-experimentalTag">Experimental</Localized>
      </div>
      <Tooltip
        id="common-experimentalTag-tooltip"
        title={
          <Localized id="common-experimentalTag-tooltip-title">
            <span>Experimental feature</span>
          </Localized>
        }
        body={content}
        button={({ toggleVisibility, ref, visible }) => (
          <Localized
            id="comments-featuredCommentTooltip-toggleButton"
            attrs={{ "aria-label": true, title: true }}
          >
            <TooltipButton
              classes={{
                button: classes.button,
              }}
              active={visible}
              activeColor="primary"
              ariaLabel="Toggle experimental tooltip"
              aria-label="Toggle experimental tooltip"
              title="Toggle experimental tooltip"
              toggleVisibility={toggleVisibility}
              ref={ref}
            />
          </Localized>
        )}
      />
    </Flex>
  );
};

const enhanced = withStyles(styles)(ExperimentalTag);

export default enhanced;
