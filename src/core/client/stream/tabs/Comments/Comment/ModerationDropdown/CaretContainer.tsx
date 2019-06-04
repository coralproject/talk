import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { CaretContainer_comment as CommentData } from "coral-stream/__generated__/CaretContainer_comment.graphql";
import { Button, ClickOutside, Icon, Popover } from "coral-ui/components";

import ModerationDropdownContainer from "./ModerationDropdownContainer";

import styles from "./CaretContainer.css";

interface Props {
  comment: CommentData;
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
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <ModerationDropdownContainer comment={props.comment} />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, visible, ref }) => (
          <Button
            variant="ghost"
            size="small"
            className={styles.root}
            onClick={toggleVisibility}
            aria-controls={popoverID}
            active={visible}
            ref={ref}
          >
            <Icon>{visible ? "expand_less" : "expand_more"}</Icon>
          </Button>
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
})(CaretContainer);

export default enhanced;
