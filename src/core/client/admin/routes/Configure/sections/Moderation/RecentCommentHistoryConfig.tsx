import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { DURATION_UNIT, DurationField } from "coral-framework/components";
import {
  formatPercentage,
  parsePercentage,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validatePercentage,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import OnOffField from "../../OnOffField";
import SectionContent from "../../SectionContent";

import styles from "./RecentCommentHistoryConfig.css";

interface Props {
  disabled: boolean;
}

const RecentCommentHistoryConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
      <Localized id="configure-moderation-recentCommentHistory-title">
        <Header container="legend">Recent history</Header>
      </Localized>
      <SectionContent>
        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-recentCommentHistory-timeFrame">
            <InputLabel container="legend">
              Recent comment history time period
            </InputLabel>
          </Localized>
          <Localized id="configure-moderation-recentCommentHistory-timeFrame-description">
            <InputDescription>
              The period of time over which a user’s rejection rate is
              calculated.
            </InputDescription>
          </Localized>
          <Field
            name="recentCommentHistory.timeFrame"
            validate={composeValidators(
              required,
              validateWholeNumberGreaterThan(0)
            )}
          >
            {({ input, meta }) => (
              <>
                <DurationField
                  units={[DURATION_UNIT.DAYS]}
                  disabled={disabled}
                  {...input}
                />
                <ValidationMessage meta={meta} />
              </>
            )}
          </Field>
        </FormField>
        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-recentCommentHistory-enabled">
            <InputLabel container="legend">Recent history filter</InputLabel>
          </Localized>
          <Localized
            id="configure-moderation-recentCommentHistory-enabled-description"
            strong={<strong />}
          >
            <InputDescription>
              Prevents repeat offenders from publishing comments without
              approval. After a commenter's rejection rate rises above the
              defined threshold below, their next submitted comments are{" "}
              <strong>sent to Pending for moderator approval.</strong> The
              filter is removed when their rejection rate falls below the
              threshold.
            </InputDescription>
          </Localized>
          <OnOffField name="recentCommentHistory.enabled" disabled={disabled} />
        </FormField>
        <FormField>
          <Localized id="configure-moderation-recentCommentHistory-triggerRejectionRate">
            <InputLabel>Rejection rate threshold</InputLabel>
          </Localized>
          <Localized id="configure-moderation-recentCommentHistory-triggerRejectionRate-description">
            <InputDescription>
              A user’s rejected comments divided by their published comments,
              over the time period set below (does not include comments pending
              for toxicity, spam or pre-moderation.)
            </InputDescription>
          </Localized>
          <Field
            name="recentCommentHistory.triggerRejectionRate"
            parse={parsePercentage}
            format={formatPercentage}
            validate={validatePercentage(0, 1)}
          >
            {({ input, meta }) => (
              <>
                <TextField
                  classes={{
                    input: styles.thresholdTextField,
                  }}
                  disabled={disabled}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  adornment={<Typography variant="bodyShort">%</Typography>}
                  textAlignCenter
                  {...input}
                />
                <ValidationMessage meta={meta} />
              </>
            )}
          </Field>
        </FormField>
      </SectionContent>
    </HorizontalGutter>
  );
};

export default RecentCommentHistoryConfig;
