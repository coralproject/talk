import { FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { PropTypesOf } from "talk-framework/types";

import ValidationMessage from "talk-admin/routes/configure/components/ValidationMessage";
import { OnSubmit } from "talk-framework/lib/form";
import { AriaInfo, Button, Flex, HorizontalGutter } from "talk-ui/components";

import RemainingCharactersContainer from "../containers/RemainingCharactersContainer";
import { cleanupRTEEmptyHTML, getCommentBodyValidators } from "../helpers";
import RTE from "./RTE";

import PostCommentSubmitStatusContainer from "../containers/PostCommentSubmitStatusContainer";
import styles from "./PostCommentForm.css";

interface FormProps {
  body: string;
}

export interface PostCommentFormProps {
  onSubmit: OnSubmit<FormProps>;
  onChange?: (state: FormState, form: FormApi) => void;
  initialValues?: FormProps;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  submitStatus: PropTypesOf<PostCommentSubmitStatusContainer>["status"];
}

const PostCommentForm: StatelessComponent<PostCommentFormProps> = props => (
  <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
    {({ handleSubmit, submitting, submitError, form }) => (
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className={styles.root}
        id="comments-postCommentForm-form"
      >
        <FormSpy
          onChange={state => props.onChange && props.onChange(state, form)}
        />
        <HorizontalGutter>
          <Field
            name="body"
            validate={getCommentBodyValidators(props.min, props.max)}
          >
            {({ input, meta }) => (
              <>
                <HorizontalGutter size="half">
                  <Localized id="comments-postCommentForm-rteLabel">
                    <AriaInfo
                      component="label"
                      htmlFor="comments-postCommentForm-field"
                    >
                      Post a comment
                    </AriaInfo>
                  </Localized>
                  <Localized
                    id="comments-postCommentForm-rte"
                    attrs={{ placeholder: true }}
                  >
                    <RTE
                      inputId="comments-postCommentForm-field"
                      onChange={({ html }) =>
                        input.onChange(cleanupRTEEmptyHTML(html))
                      }
                      value={input.value}
                      placeholder="Post a comment"
                      disabled={submitting || props.disabled}
                    />
                  </Localized>
                  {props.disabled ? (
                    <>
                      {props.disabledMessage && (
                        <ValidationMessage fullWidth>
                          {props.disabledMessage}
                        </ValidationMessage>
                      )}
                    </>
                  ) : (
                    <>
                      {meta.touched &&
                        (meta.error ||
                          (meta.submitError && !meta.dirtySinceLastSubmit)) && (
                          <ValidationMessage fullWidth>
                            {meta.error || meta.submitError}
                          </ValidationMessage>
                        )}
                      {submitError && (
                        <ValidationMessage fullWidth>
                          {submitError}
                        </ValidationMessage>
                      )}
                      <PostCommentSubmitStatusContainer
                        status={props.submitStatus}
                      />
                      {props.max && (
                        <RemainingCharactersContainer
                          value={input.value}
                          max={props.max}
                        />
                      )}
                    </>
                  )}
                </HorizontalGutter>
                <Flex direction="column" alignItems="flex-end">
                  <Localized id="comments-postCommentForm-submit">
                    <Button
                      color="primary"
                      variant="filled"
                      disabled={submitting || !input.value || props.disabled}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Localized>
                </Flex>
              </>
            )}
          </Field>
        </HorizontalGutter>
      </form>
    )}
  </Form>
);

export default PostCommentForm;
