import { FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Form } from "react-final-form";

import { FormInitializer } from "talk-framework/lib/form";
import { PropTypesOf } from "talk-framework/types";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Typography,
} from "talk-ui/components";

import PremodConfigContainer from "../containers/PremodConfigContainer";
import PremodLinksConfigContainer from "../containers/PremodLinksConfigContainer";

import styles from "./ConfigureCommentStream.css";

interface Props {
  onSubmit: (settings: any, form: FormApi) => void;
  story: PropTypesOf<typeof PremodConfigContainer>["story"] &
    PropTypesOf<typeof PremodLinksConfigContainer>["story"];
}

const ConfigureCommentStream: StatelessComponent<Props> = ({
  onSubmit,
  story,
}) => (
  <Form onSubmit={onSubmit}>
    {({ handleSubmit, submitting, pristine, form, submitError }) => (
      <FormInitializer form={form}>
        {({ onInitValues }) => (
          <form autoComplete="off" onSubmit={handleSubmit} id="configure-form">
            <Flex
              justifyContent="space-between"
              alignItems="flex-start"
              itemGutter
            >
              <Localized id="configure-commentStream-title">
                <Typography variant="heading2" className={styles.heading}>
                  Configure this Comment Stream
                </Typography>
              </Localized>
              <Localized id="configure-commentStream-apply">
                <Button
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
              {submitError && <CallOut color="error">{submitError}</CallOut>}
              <PremodConfigContainer
                onInitValues={onInitValues}
                story={story}
                disabled={submitting}
              />
              <PremodLinksConfigContainer
                onInitValues={onInitValues}
                story={story}
                disabled={submitting}
              />
            </HorizontalGutter>
          </form>
        )}
      </FormInitializer>
    )}
  </Form>
);

export default ConfigureCommentStream;
