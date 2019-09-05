import { FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import { FormInitializer } from "coral-framework/lib/form";
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
  storySettings: PropTypesOf<typeof PremodConfigContainer>["storySettings"] &
    PropTypesOf<typeof PremodLinksConfigContainer>["storySettings"] &
    PropTypesOf<typeof MessageBoxConfigContainer>["storySettings"] &
    PropTypesOf<typeof LiveUpdatesConfigContainer>["storySettings"] &
    PropTypesOf<typeof LiveUpdatesConfigContainer>["storySettingsReadOnly"];
}

const ConfigureStream: FunctionComponent<Props> = ({
  onSubmit,
  storySettings,
}) => (
  <Form onSubmit={onSubmit}>
    {({ handleSubmit, submitting, pristine, form, submitError }) => (
      <FormInitializer form={form}>
        {({ onInitValues }) => (
          <form
            className={CLASSES.configureCommentStream.$root}
            autoComplete="off"
            onSubmit={handleSubmit}
            id="configure-form"
          >
            <Flex
              justifyContent="space-between"
              alignItems="flex-start"
              itemGutter
            >
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
                onInitValues={onInitValues}
                storySettings={storySettings}
                storySettingsReadOnly={storySettings}
                disabled={submitting}
              />
              <PremodConfigContainer
                onInitValues={onInitValues}
                storySettings={storySettings}
                disabled={submitting}
              />
              <PremodLinksConfigContainer
                onInitValues={onInitValues}
                storySettings={storySettings}
                disabled={submitting}
              />
              <MessageBoxConfigContainer
                onInitValues={onInitValues}
                storySettings={storySettings}
                disabled={submitting}
              />
            </HorizontalGutter>
          </form>
        )}
      </FormInitializer>
    )}
  </Form>
);

export default ConfigureStream;
