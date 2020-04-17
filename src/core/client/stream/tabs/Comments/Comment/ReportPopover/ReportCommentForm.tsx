import { Localized } from "@fluent/react/compat";
import { get } from "lodash";
import React, { FunctionComponent } from "react";
import { Field, FieldProps, Form } from "react-final-form";

import { OnSubmit } from "coral-framework/lib/form";
import { validateMaxLength } from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import {
  Button,
  Flex,
  HorizontalGutter,
  RadioButton,
  Typography,
} from "coral-ui/components";

import PropagateMount from "./PropagateMount";

import styles from "./ReportCommentForm.css";

const RadioField: FunctionComponent<Pick<
  FieldProps<string, any>,
  "validate" | "name" | "value" | "disabled" | "children"
>> = ({ name, value, disabled, children }) => (
  <Field name={name} type="radio" value={value}>
    {({ input }) => (
      <RadioButton
        {...input}
        id={`reportComment-popover--${input.name}-${value}`}
        disabled={disabled}
        value={value}
      >
        {children}
      </RadioButton>
    )}
  </Field>
);

interface Props {
  id: string;
  onCancel: () => void;
  onResize: () => void;
  onSubmit: OnSubmit<any>;
}

export interface FormProps {
  reason:
    | "COMMENT_REPORTED_OFFENSIVE"
    | "COMMENT_REPORTED_SPAM"
    | "COMMENT_REPORTED_OTHER"
    | "DISAGREE";
  additionalDetails?: string;
}

class ReportCommentForm extends React.Component<Props> {
  public render() {
    const { onCancel, onSubmit, onResize, id } = this.props;
    return (
      <Form onSubmit={onSubmit}>
        {({
          handleSubmit,
          submitting,
          hasValidationErrors,
          form,
          submitError,
        }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className={styles.root}
            id="report-comments-form"
          >
            <HorizontalGutter className={styles.root}>
              <Localized id="comments-reportPopover-reportThisComment">
                <Typography variant="heading2" className={styles.title}>
                  Report This Comment
                </Typography>
              </Localized>
              <HorizontalGutter size="half">
                <Localized id="comments-reportPopover-whyAreYouReporting">
                  <Typography variant="detail" className={styles.detail}>
                    Why are you reporting this comment?
                  </Typography>
                </Localized>
                <ul className={styles.list}>
                  <li>
                    <Localized id="comments-reportPopover-reasonOffensive">
                      <RadioField
                        name="reason"
                        value="COMMENT_REPORTED_OFFENSIVE"
                        disabled={submitting}
                      >
                        This comment is offensive
                      </RadioField>
                    </Localized>
                  </li>
                  <li>
                    <Localized id="comments-reportPopover-reasonIDisagree">
                      <RadioField
                        name="reason"
                        value="DISAGREE"
                        disabled={submitting}
                      >
                        I disagree with this comment
                      </RadioField>
                    </Localized>
                  </li>
                  <li>
                    <Localized id="comments-reportPopover-reasonSpam">
                      <RadioField
                        name="reason"
                        value="COMMENT_REPORTED_SPAM"
                        disabled={submitting}
                      >
                        This looks like an ad or marketing
                      </RadioField>
                    </Localized>
                  </li>
                  <li>
                    <Localized id="comments-reportPopover-reasonOther">
                      <RadioField
                        name="reason"
                        value="COMMENT_REPORTED_OTHER"
                        disabled={submitting}
                      >
                        Other
                      </RadioField>
                    </Localized>
                  </li>
                </ul>
                {get(form.getFieldState("reason"), "value") && (
                  <>
                    <PropagateMount onMount={onResize} />
                    <Localized id="comments-reportPopover-pleaseLeaveAdditionalInformation">
                      <Typography
                        variant="detail"
                        className={styles.detail}
                        container={
                          <label
                            htmlFor={`comments-reportCommentForm-aditionalDetails--${id}`}
                          />
                        }
                      >
                        Please leave any additional information that may be
                        helpful to our moderators. (Optional)
                      </Typography>
                    </Localized>
                    <div>
                      <Field
                        name="additionalDetails"
                        validate={validateMaxLength(500)}
                      >
                        {({ input, meta }) => (
                          <div>
                            <textarea
                              {...input}
                              id={`comments-reportCommentForm-aditionalDetails--${id}`}
                              className={styles.textarea}
                              disabled={submitting}
                            />
                            {/* TODO: (wyattjoh) check to see if this should be replaced by the framework validation message */}
                            {(meta.error && (
                              <Typography
                                variant="detail"
                                color="error"
                                className={styles.textareaInfo}
                              >
                                {meta.error}
                              </Typography>
                            )) || (
                              <Localized
                                id="comments-reportPopover-maxCharacters"
                                $maxCharacters={500}
                              >
                                <Typography
                                  variant="detail"
                                  color="textSecondary"
                                  className={styles.textareaInfo}
                                >
                                  Max. 500 Characters
                                </Typography>
                              </Localized>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                  </>
                )}
                {submitError && (
                  <ValidationMessage>{submitError}</ValidationMessage>
                )}
              </HorizontalGutter>
              {get(form.getFieldState("reason"), "value") && (
                <Flex alignItems="center" justifyContent="flex-end">
                  <Localized id="comments-reportPopover-cancel">
                    <Button
                      className={CLASSES.reportPopover.cancelButton}
                      color="primary"
                      size="small"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </Localized>
                  <Localized id="comments-reportPopover-submit">
                    <Button
                      className={CLASSES.reportPopover.submitButton}
                      color="primary"
                      size="small"
                      variant="filled"
                      type="submit"
                      disabled={submitting || hasValidationErrors}
                    >
                      Submit
                    </Button>
                  </Localized>
                </Flex>
              )}
            </HorizontalGutter>
          </form>
        )}
      </Form>
    );
  }
}

export default ReportCommentForm;
