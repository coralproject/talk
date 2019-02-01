import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "talk-framework/lib/validation";
import {
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import Header from "../../../components/Header";

import styles from "./CommentEditingConfig.css";

interface Props {
  disabled: boolean;
}

const CommentEditingConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-commentEditing-title">
      <Header>Comment Editing</Header>
    </Localized>
    <Localized
      id="configure-general-commentEditing-explanation"
      strong={<strong />}
    >
      <Typography variant="detail">
        Set a limit on how long commenters have to edit their comments sitewide.
        Edited comments are marked as (Edited) on the comment stream and the
        moderation panel.
      </Typography>
    </Localized>

    <FormField>
      <Localized id="configure-general-commentEditing-commentEditTimeFrame">
        <InputLabel htmlFor="configure-general-commentEditing-timeframe">
          Comment Edit Timeframe
        </InputLabel>
      </Localized>
      <Field
        name="editCommentWindowLength"
        validate={composeValidators(
          required,
          validateWholeNumberGreaterThanOrEqual(0)
        )}
      >
        {({ input, meta }) => (
          <>
            <TextField
              id="configure-general-commentEditing-timeframe"
              className={styles.commentEditingTextInput}
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              adornment={
                <Localized id="configure-general-commentEditing-seconds">
                  <Typography variant="bodyCopy">Seconds</Typography>
                </Localized>
              }
              placeholder={"E.g. 30"}
              textAlignCenter
            />
            {meta.touched &&
              (meta.error || meta.submitError) && (
                <ValidationMessage>
                  {meta.error || meta.submitError}
                </ValidationMessage>
              )}
          </>
        )}
      </Field>
    </FormField>
  </HorizontalGutter>
);

export default CommentEditingConfig;
