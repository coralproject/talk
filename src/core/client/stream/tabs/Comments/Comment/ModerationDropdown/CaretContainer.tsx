import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  BaseButton,
  ClickOutside,
  Icon,
  Popover,
} from "coral-ui/components/v2";

import { CaretContainer_comment } from "coral-stream/__generated__/CaretContainer_comment.graphql";
import { CaretContainer_settings } from "coral-stream/__generated__/CaretContainer_settings.graphql";
import { CaretContainer_story } from "coral-stream/__generated__/CaretContainer_story.graphql";
import { CaretContainer_viewer } from "coral-stream/__generated__/CaretContainer_viewer.graphql";

import ModerationDropdownContainer from "./ModerationDropdownContainer";

import styles from "./CaretContainer.css";

interface Props {
  comment: CaretContainer_comment;
  story: CaretContainer_story;
  viewer: CaretContainer_viewer;
  settings: CaretContainer_settings;
}

const CaretContainer: FunctionComponent<Props> = (props) => {
  const popoverID = `comments-moderationMenu-${props.comment.id}`;
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
              viewer={props.viewer}
              settings={props.settings}
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
            <BaseButton
              className={cn(
                styles.root,
                CLASSES.comment.topBar.caretButton,
                visible ? [styles.active] : []
              )}
              onClick={toggleVisibility}
              aria-controls={popoverID}
              ref={ref}
              aria-label="Moderate"
            >
              <Icon>{visible ? "expand_less" : "expand_more"}</Icon>
            </BaseButton>
          </Localized>
        )}
      </Popover>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment CaretContainer_comment on Comment {
      id
      ...ModerationDropdownContainer_comment
    }
  `,
  story: graphql`
    fragment CaretContainer_story on Story {
      ...ModerationDropdownContainer_story
    }
  `,
  settings: graphql`
    fragment CaretContainer_settings on Settings {
      ...ModerationDropdownContainer_settings
    }
  `,
  viewer: graphql`
    fragment CaretContainer_viewer on User {
      ...ModerationDropdownContainer_viewer
    }
  `,
})(CaretContainer);

export default enhanced;
