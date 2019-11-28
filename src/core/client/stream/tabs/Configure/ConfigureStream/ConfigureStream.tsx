import { FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import { purgeMetadata } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import { LiveUpdatesConfigContainer } from "./LiveUpdatesConfig";
import MessageBoxConfigContainer from "./MessageBoxConfig";
import PremodConfigContainer from "./PremodConfig";
import PremodLinksConfigContainer from "./PremodLinksConfig";

import styles from "./ConfigureStream.css";

interface Props {
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
        <Flex justifyContent="space-between" alignItems="flex-start" itemGutter>
          <Localized id="configure-stream-title">
            <Typography variant="heading2" className={styles.heading}>
              Configure this Comment Stream
            </Typography>
          </Localized>
          <Localized id="configure-stream-apply">
            <Button
              className={CLASSES.configureCommentStream.applyButton}
              color="success"
              variant="filled"
              type="submit"
              disabled={submitting || pristine}
            >
              Apply
            </Button>
          </Localized>
        </Flex>
        <HorizontalGutter size="double">
          {submitError && (
            <CallOut
              className={CLASSES.configureCommentStream.errorMessage}
              color="error"
            >
              {submitError}
            </CallOut>
          )}
          <LiveUpdatesConfigContainer
            storySettings={storySettings}
            disabled={submitting}
          />
          <PremodConfigContainer disabled={submitting} />
          <PremodLinksConfigContainer disabled={submitting} />
          <MessageBoxConfigContainer disabled={submitting} />
        </HorizontalGutter>
      </form>
    )}
  </Form>
);

export default ConfigureStream;
