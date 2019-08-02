import { PropTypesOf } from "coral-framework/types";
import { FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { OnSubmit } from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  ValidationMessage,
} from "coral-ui/components";

import { cleanupRTEEmptyHTML, getCommentBodyValidators } from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTE from "../../RTE";
import MessageBoxContainer from "../MessageBoxContainer";
import PostCommentSubmitStatusContainer from "./PostCommentSubmitStatusContainer";

import styles from "./PostCommentForm.css";

interface FormProps {
  body: string;
}

interface Props {
  onSubmit: OnSubmit<FormProps>;
  onChange?: (state: FormState, form: FormApi) => void;
  initialValues?: FormProps;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  submitStatus: PropTypesOf<PostCommentSubmitStatusContainer>["status"];
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}

const PostCommentForm: FunctionComponent<Props> = props => (
  <div>
    {props.showMessageBox && (
      <MessageBoxContainer story={props.story} className={styles.messageBox} />
    )}
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, submitError, form }) => (
        <form
          className={CLASSES.createComment.$root}
          autoComplete="off"
          onSubmit={handleSubmit}
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
              {/* FIXME: (wyattjoh) reorganize this */}
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
                        className={CLASSES.createComment.box}
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
                            (meta.submitError &&
                              !meta.dirtySinceLastSubmit)) && (
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
                        className={CLASSES.createComment.submit}
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
  </div>
);

export default PostCommentForm;
