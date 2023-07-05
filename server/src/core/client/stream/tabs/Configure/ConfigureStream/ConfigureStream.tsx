import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import { purgeMetadata } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import PremodConfigContainer from "./PremodConfig";
import PremodLinksConfigContainer from "./PremodLinksConfig";
import { UpdateStorySettingsInput } from "./UpdateStorySettingsMutation";

import styles from "./ConfigureStream.css";

interface Props {
  storyID: string;
  onSubmit: (settings: any, form: FormApi) => void;
  storySettings: UpdateStorySettingsInput["settings"];
}

const ConfigureStream: FunctionComponent<Props> = ({
  onSubmit,
  storySettings,
}) => {
  return (
    <section aria-labelledby="configure-stream-configureThisStream-title">
      <Form onSubmit={onSubmit} initialValues={purgeMetadata(storySettings)}>
        {({
          handleSubmit,
          submitting,
          pristine,
          submitError,
          submitSucceeded,
        }) => (
          <form
            className={CLASSES.configureCommentStream.$root}
            autoComplete="off"
            onSubmit={handleSubmit}
            id="configure-form"
          >
            <Localized id="configure-stream-title-configureThisStream">
              <div
                className={styles.heading}
                id="configure-stream-configureThisStream-title"
              >
                Configure this stream
              </div>
            </Localized>
            <div className={styles.configureItems}>
              <PremodConfigContainer disabled={submitting} />
              <PremodLinksConfigContainer disabled={submitting} />
            </div>
            <Localized id="configure-stream-update">
              <Button
                className={CLASSES.configureCommentStream.applyButton}
                color="primary"
                variant="filled"
                type="submit"
                disabled={submitting || pristine}
                upperCase
                data-testid="configure-stream-apply"
              >
                Update
              </Button>
            </Localized>
            <div
              className={
                submitSucceeded || submitError
                  ? styles.footerWithMessage
                  : styles.footer
              }
            >
              {submitSucceeded && (
                <CallOut
                  className={CLASSES.configureCommentStream.successMessage}
                  color="success"
                  icon={<Icon size="sm">check_circle</Icon>}
                  title={
                    <Localized id="configure-stream-streamHasBeenUpdated">
                      This stream has been updated
                    </Localized>
                  }
                  aria-live="polite"
                />
              )}
              {submitError && (
                <CallOut
                  className={CLASSES.configureCommentStream.errorMessage}
                  color="error"
                  icon={<Icon size="sm">error</Icon>}
                  title={submitError}
                  role="alert"
                />
              )}
            </div>
          </form>
        )}
      </Form>
    </section>
  );
};

export default ConfigureStream;
