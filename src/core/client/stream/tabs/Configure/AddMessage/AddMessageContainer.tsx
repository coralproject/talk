import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { AddMessageContainer_story } from "coral-stream/__generated__/AddMessageContainer_story.graphql";

import AddMessageClosed from "./AddMessageClosed";
import AddMessageOpen from "./AddMessageOpen";

import styles from "./AddMessageContainer.css";

interface Props {
  story: AddMessageContainer_story;
}

const AddMessageContainer: FunctionComponent<Props> = ({ story }) => {
  const [open, setOpen] = useState(story.settings.messageBox.enabled);
  const [removed, setRemoved] = useState(false);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const onRemove = useCallback(() => {
    setOpen(false);
    setRemoved(true);
  }, [setOpen, setRemoved]);
  const onCloseCallout = useCallback(() => {
    setRemoved(false);
  }, [setRemoved]);

  if (open) {
    return (
      <section aria-labelledby="configure-addMessage-title">
        <AddMessageOpen
          storyID={story.id}
          storySettings={story.settings}
          onCancel={onClose}
          onRemove={onRemove}
        />
      </section>
    );
  } else {
    return (
      <section aria-labelledby="configure-addMessage-title">
        <AddMessageClosed onClick={onOpen} />
        <div
          className={removed ? styles.messagesVisible : styles.messagesHidden}
        >
          {removed && (
            <CallOut
              color="success"
              icon={<Icon size="sm">check_circle</Icon>}
              title={
                <Localized id="config-addMessage-removed">
                  Message has been removed
                </Localized>
              }
              visible={removed}
              onClose={onCloseCallout}
              aria-live="polite"
            />
          )}
        </div>
      </section>
    );
  }
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment AddMessageContainer_story on Story {
      id
      settings {
        ...MessageBoxConfig_formValues @relay(mask: false)
      }
    }
  `,
})(AddMessageContainer);

export default enhanced;
