import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import { purgeMetadata } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { LiveUpdatesConfigContainer } from "./LiveUpdatesConfig";
import MessageBoxConfigContainer from "./MessageBoxConfig";
import PremodConfigContainer from "./PremodConfig";
import PremodLinksConfigContainer from "./PremodLinksConfig";

import styles from "./ConfigureStream.css";

interface Props {
  storyID: string;
  onSubmit: (settings: any, form: FormApi) => void;
  storySettings: PropTypesOf<
    typeof LiveUpdatesConfigContainer
  >["storySettings"];
}

const ConfigureStream: FunctionComponent<Props> = ({
  onSubmit,
  storySettings,
}) => (
  <Form onSubmit={onSubmit} initialValues={purgeMetadata(storySettings)}>
    {({ handleSubmit, submitting, pristine, submitError }) => (
      <form
        className={CLASSES.configureCommentStream.$root}
        autoComplete="off"
        onSubmit={handleSubmit}
        id="configure-form"
      >
        <Localized id="configure-stream-title-configureThisStream">
          <div className={styles.heading}>Configure this Stream</div>
        </Localized>
        <div className={styles.liveUpdates}>
          <LiveUpdatesConfigContainer
            storySettings={storySettings}
            disabled={submitting}
          />
          <PremodConfigContainer disabled={submitting} />
          <PremodLinksConfigContainer disabled={submitting} />
          <MessageBoxConfigContainer disabled={submitting} />
        </div>
        <Localized id="configure-stream-update">
          <Button
            className={CLASSES.configureCommentStream.applyButton}
            color="secondary"
            variant="filled"
            type="submit"
            disabled={submitting || pristine}
            upperCase
            data-testid="configure-stream-apply"
          >
            Update
          </Button>
        </Localized>
        <div className={styles.footer}>
          {submitError && (
            <CallOut
              className={CLASSES.configureCommentStream.errorMessage}
              color="negative"
              icon={<Icon size="sm">error</Icon>}
              titleWeight="semiBold"
              title={submitError}
            />
          )}
        </div>
      </form>
    )}
  </Form>
);

export default ConfigureStream;
