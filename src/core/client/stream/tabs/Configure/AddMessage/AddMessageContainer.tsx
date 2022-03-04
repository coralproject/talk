import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, useFragment } from "react-relay";

import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { AddMessageContainer_story$key as AddMessageContainer_story } from "coral-stream/__generated__/AddMessageContainer_story.graphql";

import AddMessageClosed from "./AddMessageClosed";
import AddMessageOpen from "./AddMessageOpen";

import styles from "./AddMessageContainer.css";

interface Props {
  story: AddMessageContainer_story;
}

const AddMessageContainer: FunctionComponent<Props> = ({ story }) => {
  const storyData = useFragment(
    graphql`
      fragment AddMessageContainer_story on Story {
        id
        settings {
          ...MessageBoxConfig_formValues @relay(mask: false)
        }
      }
    `,
    story
  );

  const [open, setOpen] = useState(storyData.settings.messageBox.enabled);
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
          storyID={storyData.id}
          storySettings={storyData.settings}
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

export default AddMessageContainer;
