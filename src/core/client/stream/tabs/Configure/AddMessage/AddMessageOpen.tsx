import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Form } from "react-final-form";

import { purgeMetadata, useMutation } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import MessageBoxConfig from "./MessageBoxConfig";
import UpdateMessageBoxMutation from "./UpdateMessageBoxMutation";

import styles from "./AddMessageOpen.css";
import sharedStyles from "./shared.css";

interface Props {
  storyID: string;
  storySettings: any;
  onCancel: () => void;
  onRemove: () => void;
}

const AddMessageOpen: FunctionComponent<Props> = ({
  storyID,
  storySettings,
  onCancel,
  onRemove,
}) => {
  const updateMutation = useMutation(UpdateMessageBoxMutation);

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = useCallback(
    (formData: any) => {
      const { messageBox } = formData;
      if (!formData || !messageBox) {
        return;
      }

      void updateMutation({
        id: storyID,
        settings: {
          messageBox: {
            icon: messageBox.icon,
            content: messageBox.content,
            enabled: true,
          },
        },
      });
      setShowSuccess(true);
    },
    [updateMutation, setShowSuccess]
  );
  const onRemoveClicked = useCallback(() => {
    void updateMutation({
      id: storyID,
      settings: {
        messageBox: { icon: "", content: "", enabled: false },
      },
    });
    onRemove();
  }, [onRemove]);
  const onCancelClicked = useCallback(() => {
    onCancel();
  }, [onCancel]);
  const onCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, [setShowSuccess]);

  const renderSuccess = useMemo(() => {
    return (
      <div
        className={showSuccess ? styles.messagesVisible : styles.messagesHidden}
      >
        {showSuccess && (
          <CallOut
            color="success"
            icon={<Icon size="sm">check_circle</Icon>}
            title={
              <Localized id="config-addMessage-messageHasBeenAdded">
                The message has been added to the comment box
              </Localized>
            }
            visible={showSuccess}
            onClose={onCloseSuccess}
            aria-live="polite"
          />
        )}
      </div>
    );
  }, [showSuccess]);

  return (
    <div className={CLASSES.openCommentStream.$root}>
      <Localized id="configure-addMessage-title">
        <div className={sharedStyles.heading} id="configure-addMessage-title">
          Add a message or question
        </div>
      </Localized>
      <Localized id="configure-addMessage-description">
        <div className={sharedStyles.description}>
          Add a message to the top of the comment box for your readers. Use this
          to pose a topic, ask a question or make announcements relating to this
          story.
        </div>
      </Localized>
      <Form onSubmit={onSubmit} initialValues={purgeMetadata(storySettings)}>
        {({ handleSubmit, submitting, pristine }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            id="message-box-form"
            data-testid="configure-addMessage-form"
          >
            <MessageBoxConfig />
            {storySettings.messageBox.content ? (
              <div className={styles.actions}>
                <Button
                  className={cn(
                    CLASSES.configureCommentStream.applyButton,
                    styles.cancel
                  )}
                  color="error"
                  variant="outlined"
                  disabled={submitting}
                  upperCase
                  data-testid="configure-addMessage-remove"
                  onClick={onRemoveClicked}
                >
                  <Localized id="configure-addMessage-remove">Remove</Localized>
                </Button>
                <Button
                  className={CLASSES.configureCommentStream.applyButton}
                  color="primary"
                  variant="filled"
                  type="submit"
                  disabled={submitting || pristine}
                  upperCase
                  data-testid="configure-addMessage-submitUpdate"
                >
                  <Localized id="configure-addMessage-submitUpdate">
                    Update
                  </Localized>
                </Button>
                {renderSuccess}
              </div>
            ) : (
              <div className={styles.actions}>
                <Button
                  className={cn(
                    CLASSES.configureCommentStream.applyButton,
                    styles.cancel
                  )}
                  color="secondary"
                  variant="outlined"
                  disabled={submitting}
                  upperCase
                  data-testid="configure-addMessage-cancel"
                  onClick={onCancelClicked}
                >
                  <Localized id="configure-addMessage-cancel">Cancel</Localized>
                </Button>
                <Button
                  className={CLASSES.configureCommentStream.applyButton}
                  color="primary"
                  variant="filled"
                  type="submit"
                  disabled={submitting || pristine}
                  upperCase
                  data-testid="configure-addMessage-submitAdd"
                >
                  <Localized id="configure-addMessage-submitAdd">
                    Add message
                  </Localized>
                </Button>
                {renderSuccess}
              </div>
            )}
          </form>
        )}
      </Form>
    </div>
  );
};

export default AddMessageOpen;
