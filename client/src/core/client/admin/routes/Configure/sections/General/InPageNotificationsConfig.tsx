import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

import styles from "./InPageNotificationsConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment InPageNotificationsConfig_formValues on Settings {
    inPageNotifications {
      enabled
      floatingBellIndicator
    }
  }
`;

interface Props {
  disabled: boolean;
}

const InPageNotificationsConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-inPageNotifications-title">
        <Header container="h2">In-page notifications</Header>
      </Localized>
    }
  >
    <Localized id="configure-general-inPageNotifications-explanation">
      <FormFieldDescription>
        Add notifications to Coral. When enabled, commenters can receive
        notifications when they receive all replies, replies only from members
        of your team, when a Pending comment is published. Commenters can
        disable visual notification indicators in their Profile preferences.
        This will remove e-mail notifications.
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-inPageNotifications-enabled">
        <Label component="legend">In-page notifications enabled</Label>
      </Localized>
      <OnOffField name="inPageNotifications.enabled" disabled={disabled} />
    </FormField>
    <FormSpy subscription={{ values: true }}>
      {(props) => {
        const inPageDisabled = !props.values.inPageNotifications?.enabled;
        return (
          <FormField container={<FieldSet />}>
            <Localized id="configure-general-inPageNotifications-floatingBellIndicator">
              <Label
                className={
                  disabled || inPageDisabled ? styles.disabledLabel : ""
                }
                component="legend"
              >
                Floating bell indicator
              </Label>
            </Localized>
            <OnOffField
              name="inPageNotifications.floatingBellIndicator"
              disabled={disabled || inPageDisabled}
            />
          </FormField>
        );
      }}
    </FormSpy>
  </ConfigBox>
);

export default InPageNotificationsConfig;
