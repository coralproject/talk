import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { LiveUpdatesConfigContainer_story } from "coral-stream/__generated__/LiveUpdatesConfigContainer_story.graphql";

import DisableLiveUpdates from "./DisableLiveUpdates";
import EnableLiveUpdates from "./EnableLiveUpdates";
import SetLiveUpdateMutation from "./SetLiveUpdateMutation";

import styles from "./LiveUpdatesConfigContainer.css";

interface Props {
  story: LiveUpdatesConfigContainer_story;
}

const renderSuccess = (enabled?: boolean) => {
  if (enabled) {
    return (
      <Localized id="configure-liveUpdates-enabledSuccess">
        Live updates are now enabled
      </Localized>
    );
  }

  return (
    <Localized id="configure-liveUpdates-disabledSuccess">
      Live updates are now disabled
    </Localized>
  );
};

const renderMessages = (
  showSuccess: boolean,
  onCloseSuccess: () => void,
  showError: boolean,
  onCloseError: () => void,
  error?: string | null,
  enabled?: boolean
) => {
  return (
    <div
      className={
        showError || showSuccess
          ? styles.messagesVisible
          : styles.messagesHidden
      }
    >
      {showSuccess && (
        <CallOut
          color="success"
          icon={<Icon size="sm">check_circle</Icon>}
          title={renderSuccess(enabled)}
          onClose={onCloseSuccess}
          visible={showSuccess}
          aria-live="polite"
        />
      )}
      {showError && (
        <CallOut
          color="error"
          icon={<Icon size="sm">error</Icon>}
          title={error}
          onClose={onCloseError}
          visible={showError}
          role="alert"
        />
      )}
    </div>
  );
};

const LiveUpdatesConfigContainer: FunctionComponent<Props> = ({ story }) => {
  const {
    id,
    settings: {
      live: { configurable, enabled },
    },
  } = story;

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);

  const setLiveUpdate = useMutation(SetLiveUpdateMutation);
  const onClick = useCallback(async () => {
    try {
      setShowSuccess(true);
      await setLiveUpdate({
        id,
        settings: {
          live: { enabled: !enabled },
        },
      });
    } catch (err) {
      setShowError(true);
      setError(err.message);
    }
  }, [enabled, id, setShowSuccess, setShowError, setError]);

  const onCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, [setShowSuccess]);
  const onCloseError = useCallback(() => {
    setShowError(false);
  }, [setShowError]);

  if (!configurable) {
    return null;
  }

  if (enabled) {
    return (
      <section aria-labelledby="configure-disableLiveUpdates-title">
        <DisableLiveUpdates onClick={onClick} />
        {renderMessages(
          showSuccess,
          onCloseSuccess,
          showError,
          onCloseError,
          error,
          enabled
        )}
      </section>
    );
  } else {
    return (
      <section aria-labelledby="configure-enableLiveUpdates-title">
        <EnableLiveUpdates onClick={onClick} />
        {renderMessages(
          showSuccess,
          onCloseSuccess,
          showError,
          onCloseError,
          error,
          enabled
        )}
      </section>
    );
  }
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveUpdatesConfigContainer_story on Story {
      id
      settings {
        live {
          configurable
          enabled
        }
      }
    }
  `,
})(LiveUpdatesConfigContainer);

export default enhanced;
