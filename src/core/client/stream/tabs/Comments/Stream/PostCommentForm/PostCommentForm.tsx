import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi, FormState } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { useViewerEvent } from "coral-framework/lib/events";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import {
  GQLCOMMENT_MEDIA_PROVIDER,
  GQLSTORY_MODE,
} from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import { CreateCommentFocusEvent } from "coral-stream/events";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
} from "coral-ui/components/v2";

import {
  getCommentBodyValidators,
  getHTMLCharacterLength,
} from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer from "../../RTE";
import { GifResult } from "../GifSelector/GifSearchFetch";
import MessageBoxContainer from "../MessageBoxContainer";
import PostCommentInput from "./PostCommentInput";
import PostCommentSubmitStatusContainer from "./PostCommentSubmitStatusContainer";

import styles from "./PostCommentForm.css";

interface MediaProps {
  provider: GQLCOMMENT_MEDIA_PROVIDER;
  url: string;
  width: number;
  height: number;
  remote_id: string;
  mimetype: string;
  alt: string;
}

interface FormProps {
  body: string;
  media?: MediaProps;
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
  const [selectedGif, setSelectedGif] = useState<GifResult | null>(null);

  const onSubmit = useCallback(
    (values, form) => {
      if (selectedGif) {
        values.media = {
          provider: "GIPHY",
          url: selectedGif.images.original.url,
          alt: selectedGif.title,
          width: parseInt(selectedGif.images.original.width, 10),
          height: parseInt(selectedGif.images.original.height, 10),
          remote_id: selectedGif.id,
          mimetype: "image/gif",
        };
        setSelectedGif(null);
      }
      props.onSubmit(values, form);
    },
    [props.onSubmit, selectedGif]
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
        {({ handleSubmit, submitting, submitError, form }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            id="comments-postCommentForm-form"
          >
            <FormSpy
              onChange={(state) =>
                props.onChange && props.onChange(state, form)
              }
            />
            <HorizontalGutter>
              <Field
                name="body"
                validate={getCommentBodyValidators(props.min, props.max)}
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
                      <PostCommentInput
                        isQA={isQA}
                        rteConfig={props.rteConfig}
                        onFocus={onFocus}
                        onChange={(html: string) => input.onChange(html)}
                        showMessageBox={props.showMessageBox}
                        value={input.value}
                        onSetGif={setSelectedGif}
                        gif={selectedGif}
                        disabled={submitting || props.disabled}
                      />
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
                            <ValidationMessage>{submitError}</ValidationMessage>
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
                          color="stream"
                          variant="regular"
                          className={CLASSES.createComment.submit}
                          disabled={
                            submitting ||
                            getHTMLCharacterLength(input.value) === 0 ||
                            props.disabled
                          }
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
};

export default PostCommentForm;
