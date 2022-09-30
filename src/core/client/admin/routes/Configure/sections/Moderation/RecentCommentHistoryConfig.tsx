import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { formatPercentage, parsePercentage } from "coral-framework/lib/form";
import { hasError, parseInteger } from "coral-framework/lib/form/helpers";
import {
  composeValidators,
  required,
  validatePercentage,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  DURATION_UNIT,
  DurationField,
  FieldSet,
  FormField,
  FormFieldHeader,
  Label,
  TextFieldAdornment,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";
import TextFieldWithValidation from "../../TextFieldWithValidation";
import ValidationMessage from "../../ValidationMessage";

import styles from "./RecentCommentHistoryConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment RecentCommentHistoryConfig_formValues on Settings {
    recentCommentHistory {
      enabled
      timeFrame
      triggerRejectionRate
    }
  }
`;

interface Props {
  disabled: boolean;
}

const RecentCommentHistoryConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-moderation-recentCommentHistory-title">
          <Header container={<legend />}>Recent history</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <FormField container={<FieldSet />}>
        <FormFieldHeader>
          <Localized id="configure-moderation-recentCommentHistory-timeFrame">
            <Label component="legend">Recent comment history time period</Label>
          </Localized>
          <Localized id="configure-moderation-recentCommentHistory-timeFrame-description">
            <HelperText>
              The period of time over which a user’s rejection rate is
              calculated.
            </HelperText>
          </Localized>
        </FormFieldHeader>
        <Field
          name="recentCommentHistory.timeFrame"
          validate={composeValidators(
            required,
            validateWholeNumberGreaterThan(0)
          )}
          parse={parseInteger}
        >
          {({ input, meta }) => (
            <>
              <DurationField
                units={[DURATION_UNIT.DAY]}
                disabled={disabled}
                color={hasError(meta) ? "error" : "regular"}
                {...input}
              />
              <ValidationMessage meta={meta} fullWidth />
            </>
          )}
        </Field>
      </FormField>
      <FormField container={<FieldSet />}>
        <FormFieldHeader>
          <Localized id="configure-moderation-recentCommentHistory-enabled">
            <Label component="legend">Recent history filter</Label>
          </Localized>
          <Localized
            id="configure-moderation-recentCommentHistory-enabled-description"
            elems={{ strong: <strong /> }}
          >
            <HelperText>
              Prevents repeat offenders from publishing comments without
              approval. After a commenter's rejection rate rises above the
              defined threshold below, their next submitted comments are{" "}
              <strong>sent to Pending for moderator approval.</strong> The
              filter is removed when their rejection rate falls below the
              threshold.
            </HelperText>
          </Localized>
        </FormFieldHeader>
        <OnOffField name="recentCommentHistory.enabled" disabled={disabled} />
      </FormField>
      <FormField>
        <FormFieldHeader>
          <Localized id="configure-moderation-recentCommentHistory-triggerRejectionRate">
            <Label>Rejection rate threshold</Label>
          </Localized>
          <Localized id="configure-moderation-recentCommentHistory-triggerRejectionRate-description">
            <HelperText>
              A user’s rejected comments divided by their published comments,
              over the time period set below (does not include comments pending
              for toxicity, spam or pre-moderation.)
            </HelperText>
          </Localized>
        </FormFieldHeader>
        <Field
          name="recentCommentHistory.triggerRejectionRate"
          parse={parsePercentage}
          format={formatPercentage}
          validate={composeValidators(required, validatePercentage(0, 1))}
        >
          {({ input, meta }) => (
            <TextFieldWithValidation
              {...input}
              classes={{
                input: styles.thresholdTextField,
              }}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              adornment={<TextFieldAdornment>%</TextFieldAdornment>}
              meta={meta}
              textAlignCenter
            />
          )}
        </Field>
      </FormField>
    </ConfigBox>
  );
};

export default RecentCommentHistoryConfig;
