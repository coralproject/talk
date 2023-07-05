import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { formatEmpty, parseIntegerNullable } from "coral-framework/lib/form";
import {
  composeValidators,
  createValidator,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
  TextFieldAdornment,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./CommentLengthConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CommentLengthConfig_formValues on Settings {
    charCount {
      enabled
      min
      max
    }
  }
`;

const validateMaxLongerThanMin = createValidator(
  (v: any, values: any) =>
    v === null ||
    values.charCount.min === null ||
    parseInt(v, 10) > parseInt(values.charCount.min, 10),
  // eslint-disable-next-line:jsx-wrap-multiline
  <Localized id="configure-general-commentLength-validateLongerThanMin">
    <span>Please enter a number longer than the minimum length</span>
  </Localized>
);

interface Props {
  disabled: boolean;
}

const CommentLengthConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    data-testid="comment-length-config-box"
    title={
      <Localized id="configure-general-commentLength-title">
        <Header container={<legend />}>Comment length</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized
      id="configure-general-commentLength-setLimit"
      elems={{ strong: <strong /> }}
    >
      <FormFieldDescription>
        Set minimum and maximum comment length requirements. Blank spaces at the
        beginning and the end of a comment will be trimmed.
      </FormFieldDescription>
    </Localized>

    <FormField>
      <Localized id="configure-general-commentLength-limitCommentLength">
        <Label>Limit comment length</Label>
      </Localized>
      <OnOffField
        name="charCount.enabled"
        disabled={disabled}
        testIDs={{
          on: "comment-length-limit-on",
          off: "comment-length-limit-off",
        }}
      />
    </FormField>

    <FormField>
      <Localized id="configure-general-commentLength-minCommentLength">
        <Label htmlFor="configure-general-commentLength-min">
          Minimum comment length
        </Label>
      </Localized>
      <Field
        name="charCount.min"
        validate={validateWholeNumberGreaterThan(0)}
        parse={parseIntegerNullable}
        format={formatEmpty}
      >
        {({ input, meta }) => (
          <Localized
            id="configure-general-commentLength-textField"
            attrs={{ placeholder: true }}
          >
            <TextFieldWithValidation
              {...input}
              id="configure-general-commentLength-min"
              classes={{
                input: styles.commentLengthTextInput,
              }}
              disabled={disabled}
              autoComplete="off"
              meta={meta}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              adornment={
                <Localized id="configure-general-commentLength-characters">
                  <TextFieldAdornment>Characters</TextFieldAdornment>
                </Localized>
              }
              placeholder="No limit"
              textAlignCenter
            />
          </Localized>
        )}
      </Field>
    </FormField>
    <FormField>
      <Localized id="configure-general-commentLength-maxCommentLength">
        <Label htmlFor="configure-general-commentLength-max">
          Maximum comment length
        </Label>
      </Localized>
      <Field
        name="charCount.max"
        validate={composeValidators(
          validateWholeNumberGreaterThan(0),
          validateMaxLongerThanMin
        )}
        parse={parseIntegerNullable}
        format={formatEmpty}
      >
        {({ input, meta }) => (
          <Localized
            id="configure-general-commentLength-textField"
            attrs={{ placeholder: true }}
          >
            <TextFieldWithValidation
              {...input}
              id="configure-general-commentLength-max"
              classes={{
                input: styles.commentLengthTextInput,
              }}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              adornment={
                <Localized id="configure-general-commentLength-characters">
                  <TextFieldAdornment>Characters</TextFieldAdornment>
                </Localized>
              }
              placeholder={"No limit"}
              textAlignCenter
              meta={meta}
            />
          </Localized>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default CommentLengthConfig;
