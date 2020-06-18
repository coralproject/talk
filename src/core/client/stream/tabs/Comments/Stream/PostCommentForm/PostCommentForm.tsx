import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi, FormState } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { useViewerEvent } from "coral-framework/lib/events";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { GQLEMBED_SOURCE, GQLSTORY_MODE } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import { CreateCommentFocusEvent } from "coral-stream/events";
import {
  AriaInfo,
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
} from "coral-ui/components/v2";

import { getCommentBodyValidators } from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer from "../../RTE";
import GifSelector, { GifPreview } from "../GifSelector";
import MessageBoxContainer from "../MessageBoxContainer";
import PostCommentSubmitStatusContainer from "./PostCommentSubmitStatusContainer";

import styles from "./PostCommentForm.css";

interface MediaProps {
  source: GQLEMBED_SOURCE;
  url: string;
  alt: string;
}

interface FormProps {
  body: string;
  embed?: MediaProps;
}

interface FormSubmitProps extends FormProps, FormError {}

interface StorySettings {
  settings?: {
    mode?: "COMMENTS" | "QA" | "%future added value" | null;
  };
}

interface Props {
  onSubmit: OnSubmit<FormSubmitProps>;
  onChange?: (state: FormState<any>, form: FormApi) => void;
  initialValues?: FormProps;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  submitStatus: PropTypesOf<PostCommentSubmitStatusContainer>["status"];
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"] & StorySettings;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
}

const PostCommentForm: FunctionComponent<Props> = (props) => {
  const emitFocusEvent = useViewerEvent(CreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);
  const isQA =
    props.story.settings && props.story.settings.mode === GQLSTORY_MODE.QA;
  const [showGifSelector, setShowGifSelector] = useState(false);
  const onGifButtonClick = useCallback(() => {
    setShowGifSelector(!showGifSelector);
  }, [showGifSelector]);

  const onSubmit = useCallback(
    (values, form) => {
      if (values.embed && values.embed.url) {
        values.embed.source = "GIPHY";
      } else {
        delete values.embed;
      }
      props.onSubmit(values, form);
    },
    [props.onSubmit]
  );
  return (
    <div className={CLASSES.createComment.$root}>
      {props.showMessageBox && (
        <MessageBoxContainer
          story={props.story}
          className={cn(CLASSES.createComment.message, styles.messageBox)}
        />
      )}
      <Form onSubmit={onSubmit} initialValues={props.initialValues}>
        {({
          handleSubmit,
          submitting,
          submitError,
          form,
          values,
          invalid,
          ...rest
        }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            id="comments-postCommentForm-form"
          >
            <HorizontalGutter>
              <FormSpy
                onChange={(state) =>
                  props.onChange && props.onChange(state, form)
                }
              />
              <div className={styles.commentFormBox}>
                <Field
                  name="body"
                  validate={getCommentBodyValidators(
                    props.min,
                    props.max,
                    !(
                      values.embed &&
                      values.embed.url &&
                      values.embed.url.length > 0
                    )
                  )}
                  key={
                    values.embed && values.embed.url
                      ? values.embed.url.length
                      : 0
                  }
                >
                  {({ input, meta }) => (
                    <>
                      <HorizontalGutter size="half">
                        {isQA ? (
                          <Localized id="qa-postQuestionForm-rteLabel">
                            <AriaInfo
                              component="label"
                              htmlFor="comments-postCommentForm-field"
                            >
                              Post a question
                            </AriaInfo>
                          </Localized>
                        ) : (
                          <Localized id="comments-postCommentForm-rteLabel">
                            <AriaInfo
                              component="label"
                              htmlFor="comments-postCommentForm-field"
                            >
                              Post a comment
                            </AriaInfo>
                          </Localized>
                        )}
                        <div>
                          <Localized
                            id={
                              isQA
                                ? "qa-postQuestionForm-rte"
                                : "comments-postCommentForm-rte"
                            }
                            attrs={{ placeholder: true }}
                          >
                            <RTEContainer
                              inputID="comments-postCommentForm-field"
                              config={props.rteConfig}
                              onFocus={onFocus}
                              onChange={(html: string) => input.onChange(html)}
                              contentClassName={
                                undefined
                                /* props.showMessageBox ? styles.rteBorderless : undefined*/
                              }
                              value={input.value}
                              placeholder="Post a comment"
                              disabled={submitting || props.disabled}
                              toolbarButtons={
                                <Button
                                  color="mono"
                                  variant={showGifSelector ? "regular" : "flat"}
                                  onClick={onGifButtonClick}
                                  iconLeft
                                >
                                  <ButtonIcon>add</ButtonIcon>
                                  GIF
                                </Button>
                              }
                            />
                          </Localized>
                        </div>
                        {props.disabled ? (
                          <>
                            {props.disabledMessage && (
                              <ValidationMessage>
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
                                <ValidationMessage>
                                  {meta.error || meta.submitError}
                                </ValidationMessage>
                              )}
                            {submitError && (
                              <ValidationMessage>
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
                    </>
                  )}
                </Field>
                <Field name="embed.url">
                  {(fieldProps) => (
                    <div>
                      {showGifSelector && (
                        <>
                          <GifSelector
                            onGifSelect={(gif) => {
                              fieldProps.input.onChange(
                                gif.images.original.url
                              );
                              setShowGifSelector(false);
                            }}
                            value={fieldProps.input.value}
                          />
                        </>
                      )}
                      {fieldProps.input.value &&
                        fieldProps.input.value.length > 0 && (
                          <GifPreview
                            url={fieldProps.input.value}
                            onRemove={() => fieldProps.input.onChange(null)}
                            title=""
                          />
                        )}
                    </div>
                  )}
                </Field>
              </div>
              <Flex direction="column" alignItems="flex-end">
                <Localized id="comments-postCommentForm-submit">
                  <Button
                    color="stream"
                    variant="regular"
                    className={CLASSES.createComment.submit}
                    disabled={submitting || props.disabled || invalid}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Localized>
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default PostCommentForm;
