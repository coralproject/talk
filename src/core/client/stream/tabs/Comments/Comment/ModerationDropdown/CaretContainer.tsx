import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { CaretContainer_comment } from "coral-stream/__generated__/CaretContainer_comment.graphql";
import { CaretContainer_story } from "coral-stream/__generated__/CaretContainer_story.graphql";
import { Button, ClickOutside, Icon, Popover } from "coral-ui/components";

import ModerationDropdownContainer from "./ModerationDropdownContainer";

import styles from "./CaretContainer.css";

interface Props {
  comment: CaretContainer_comment;
  story: CaretContainer_story;
}

const CaretContainer: FunctionComponent<Props> = props => {
  const popoverID = `comments-moderationMenu`;
  return (
    <Localized
      id="comments-moderationDropdown-popover"
      attrs={{ description: true }}
    >
      <Popover
        id={popoverID}
        placement="bottom-end"
        description="A popover menu to moderate the comment"
        body={({ toggleVisibility, scheduleUpdate }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <ModerationDropdownContainer
              comment={props.comment}
              story={props.story}
              onDismiss={toggleVisibility}
              scheduleUpdate={scheduleUpdate}
            />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, visible, ref }) => (
          <Localized
            id="comments-moderationDropdown-caretButton"
            attrs={{ "aria-label": true }}
          >
            <Button
              variant="ghost"
              size="small"
              className={styles.root}
              onClick={toggleVisibility}
              aria-controls={popoverID}
              active={visible}
              ref={ref}
              aria-label="Moderate"
            >
              <Icon>{visible ? "expand_less" : "expand_more"}</Icon>
            </Button>
          </Localized>
        )}
      </Popover>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment CaretContainer_comment on Comment {
      ...ModerationDropdownContainer_comment
    }
  `,
  story: graphql`
    fragment CaretContainer_story on Story {
      ...ModerationDropdownContainer_story
    }
  `,
})(CaretContainer);

export default enhanced;
