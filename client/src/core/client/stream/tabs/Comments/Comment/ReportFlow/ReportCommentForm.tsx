import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { get } from "lodash";
import React, { FunctionComponent, useEffect } from "react";
import { Field, FieldProps, Form } from "react-final-form";
import { graphql } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { OnSubmit } from "coral-framework/lib/form";
import { useLocal } from "coral-framework/lib/relay";
import {
  customMessage,
  validateMaxLength,
} from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import { ShowReportPopoverEvent } from "coral-stream/events";
import {
  ButtonSvgIcon,
  ShareExternalLinkIcon,
} from "coral-ui/components/icons";
import { Flex, HorizontalGutter, RadioButton } from "coral-ui/components/v2";
import { Button, ValidationMessage } from "coral-ui/components/v3";

import { ReportCommentFormLocal } from "coral-stream/__generated__/ReportCommentFormLocal.graphql";

import styles from "./ReportCommentForm.css";

const RadioField: FunctionComponent<
  Pick<
    FieldProps<string, any>,
    "validate" | "name" | "value" | "disabled" | "children"
  >
> = ({ name, value, disabled, children }) => (
  <Field name={name} type="radio" value={value}>
    {({ input }: { input: any }) => (
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

const IllegalContentLink: FunctionComponent<{ reportLink: string }> = ({
  reportLink,
}) => (
  <Button
    className={styles.reportIllegalLink}
    variant="flat"
    color="primary"
    fontSize="medium"
    fontWeight="semiBold"
    paddingSize="none"
    target="_blank"
    anchor
    underline
    textAlign="left"
    href={reportLink}
  >
    <Localized id="comments-reportForm-reportIllegalContent-button">
      <span>This comment contains illegal content</span>
    </Localized>
    <ButtonSvgIcon className={styles.linkIcon} Icon={ShareExternalLinkIcon} />
  </Button>
);

interface Props {
  id: string;
  onCancel: () => void;
  onSubmit: OnSubmit<any>;
  biosEnabled: boolean;
  reportLink: string;
  anonymousWithDSA: boolean;
}

export interface FormProps {
  reason:
    | "COMMENT_REPORTED_OFFENSIVE"
    | "COMMENT_REPORTED_SPAM"
    | "COMMENT_REPORTED_OTHER"
    | "DISAGREE";
  additionalDetails?: string;
}

const ReportCommentForm: FunctionComponent<Props> = ({
  onCancel,
  onSubmit,
  id,
  reportLink,
  biosEnabled,
  anonymousWithDSA,
}) => {
  const [{ dsaFeaturesEnabled }] = useLocal<ReportCommentFormLocal>(
    graphql`
      fragment ReportCommentFormLocal on Local {
        dsaFeaturesEnabled
      }
    `
  );

  const emitReportEvent = useViewerEvent(ShowReportPopoverEvent);

  // Run once.
  useEffect(() => {
    emitReportEvent({ commentID: id });
  }, []);

  if (anonymousWithDSA) {
    return (
      <div
        className={cn(styles.root, CLASSES.reportPopover.$root)}
        data-testid="report-comment-form"
        role="none"
      >
        <div>
          <Localized id="comments-reportPopover-reportThisComment">
            <div className={styles.title}>Report This Comment</div>
          </Localized>
          <HorizontalGutter>
            <Localized id="comments-reportForm-signInToReport">
              <div>You have to sign in to report a comment</div>
            </Localized>
            <IllegalContentLink reportLink={reportLink} />
          </HorizontalGutter>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.root, CLASSES.reportPopover.$root)}
      data-testid="report-comment-form"
      role="none"
    >
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
            <div>
              <Localized id="comments-reportPopover-reportThisComment">
                <div className={styles.title}>Report This Comment</div>
              </Localized>
              <Localized id="comments-reportPopover-whyAreYouReporting">
                <div className={styles.heading}>
                  Why are you reporting this comment?
                </div>
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
                  <Localized id="comments-reportPopover-reasonAbusive">
                    <RadioField
                      name="reason"
                      value="COMMENT_REPORTED_ABUSIVE"
                      disabled={submitting}
                    >
                      This commenter is being abusive
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
                {biosEnabled && (
                  <li>
                    <Localized id="comments-reportPopover-reasonBio">
                      <RadioField
                        name="reason"
                        value="COMMENT_REPORTED_BIO"
                        disabled={submitting}
                      >
                        This commenter's bio is offensive or abusive
                      </RadioField>
                    </Localized>
                  </li>
                )}
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
              {dsaFeaturesEnabled && (
                <IllegalContentLink reportLink={reportLink} />
              )}
              <Localized
                id="comments-reportPopover-additionalInformation"
                elems={{ optional: <span className={styles.detail} /> }}
              >
                <label
                  className={styles.heading}
                  htmlFor={`comments-reportCommentForm-additionalDetails--${id}`}
                >
                  Additional information (Optional)
                </label>
              </Localized>
              <Localized id="comments-reportPopover-pleaseLeaveAdditionalInformation">
                <div className={styles.detail}>
                  Please leave any additional information that may be helpful to
                  our moderators.
                </div>
              </Localized>
              <div>
                <Field
                  name="additionalDetails"
                  validate={customMessage(
                    validateMaxLength(500),
                    <Localized
                      id="comments-reportPopover-restrictToMaxCharacters"
                      vars={{ maxCharacters: 500 }}
                    >
                      <span>Please restrict your report to 500 characters</span>
                    </Localized>
                  )}
                >
                  {({ input, meta }) => (
                    <div className={styles.textAreaContainer}>
                      <textarea
                        {...input}
                        data-testid="report-comment-additional-information"
                        id={`comments-reportCommentForm-additionalDetails--${id}`}
                        className={styles.textarea}
                        disabled={submitting}
                      />
                      <div className={styles.textareaInfo}>
                        {(meta.error && (
                          <ValidationMessage
                            meta={meta}
                            justifyContent="flex-end"
                          />
                        )) || (
                          <Localized
                            id="comments-reportPopover-maxCharacters"
                            vars={{ maxCharacters: 500 }}
                          >
                            <div>Max. 500 Characters</div>
                          </Localized>
                        )}
                      </div>
                    </div>
                  )}
                </Field>
              </div>
              {submitError && (
                <ValidationMessage>{submitError}</ValidationMessage>
              )}
              <Flex alignItems="center" justifyContent="flex-end">
                <Localized id="comments-reportPopover-cancel">
                  <Button
                    className={cn(
                      CLASSES.reportPopover.cancelButton,
                      styles.cancel
                    )}
                    color="secondary"
                    variant="outlined"
                    fontSize="small"
                    paddingSize="small"
                    onClick={onCancel}
                    disabled={submitting}
                    upperCase
                  >
                    Cancel
                  </Button>
                </Localized>
                <Localized id="comments-reportPopover-submit">
                  <Button
                    className={CLASSES.reportPopover.submitButton}
                    color="secondary"
                    variant="filled"
                    fontSize="small"
                    paddingSize="small"
                    type="submit"
                    disabled={
                      !get(form.getFieldState("reason"), "value") ||
                      submitting ||
                      hasValidationErrors
                    }
                    upperCase
                  >
                    Submit
                  </Button>
                </Localized>
              </Flex>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};

export default ReportCommentForm;
