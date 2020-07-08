import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
// import cn from "classnames";
import { FormApi, FormState, MutableState } from "final-form";
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  Ref,
  useCallback,
  useState,
} from "react";
import { Field, Form, FormSpy } from "react-final-form";

import {
  EmbedLink,
  findEmbedLinks,
} from "coral-framework/helpers/findEmbedLinks";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { GQLEMBED_SOURCE_RL } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import {
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  MatchMedia,
  Message,
  MessageIcon,
  RelativeTime,
} from "coral-ui/components/v2";

import {
  EmbedConfirmPrompt,
  EmbedPreview,
} from "../../Comment/EmbedConfirmation";
import GifSelector, { GifPreview } from "../../GifSelector";
import { getCommentBodyValidators } from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer from "../../RTE";

import styles from "./CommentForm.css";

export interface PasteEvent {
  fragment: DocumentFragment;
  preventDefault: () => void;
  defaultPrevented: boolean;
}

interface MediaProps {
  source: GQLEMBED_SOURCE_RL;
  url: string;
  alt: string;
}

interface FormProps {
  body: string;
  embed?: MediaProps;
}

interface FormSubmitProps extends FormProps, FormError {}

type FormAction = "CREATE" | "UPDATE";

interface Props {
  onSubmit: OnSubmit<FormSubmitProps>;
  onChange?: (state: FormState<any>, form: FormApi) => void;
  initialValues?: FormProps;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  bodyLabel: React.ReactNode;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
  onFocus?: () => void;
  rteRef?: Ref<CoralRTE>;
  onCancel?: EventHandler<MouseEvent<any>>;
  action: FormAction;
  editableUntil?: string;
  expired?: boolean;
  submitStatus?: React.ReactNode;
  classNameRoot: "createComment" | "editComment" | "createReplyComment";
}

const setFieldValue = (
  [name, value]: [string, string],
  state: MutableState<any>
) => {
  const field = state.fields[name];
  field.change(value);
};

const CommentForm: FunctionComponent<Props> = (props) => {
  const [showGifSelector, setShowGifSelector] = useState(false);
  const onGifButtonClick = useCallback(() => {
    setShowGifSelector(!showGifSelector);
  }, [showGifSelector]);
  const [embedLink, setEmbedLink] = useState<EmbedLink | null>(null);

  const onSubmit = useCallback(
    (values, form) => {
      if (
        values.embed &&
        (!values.embed.source ||
          !values.embed.url ||
          values.embed.url.length < 1)
      ) {
        delete values.embed;
      }
      if (!values.body) {
        values.body = "";
      }
      return props.onSubmit(values, form);
    },
    [props.onSubmit, embedLink]
  );

  const onPaste = useCallback((event: PasteEvent) => {
    const children = event.fragment.children;
    let link = null;
    for (let i = 0; i < children.length; i++) {
      const item = children.item(i);
      if (item && item.textContent) {
        const links = findEmbedLinks(item.textContent);
        if (links.length > 0) {
          link = links[0];
          break;
        }
      }
    }
    if (link) {
      setEmbedLink({ ...link });
    }
  }, []);

  const confirmEmbedLink = useCallback(
    (setField: (name: string, value: string) => void) => {
      if (embedLink) {
        setField("embed.url", embedLink.url);
        setField("embed.source", embedLink.source);
        setEmbedLink(null);
      }
    },
    [embedLink]
  );

  return (
    <div className={CLASSES[props.classNameRoot].$root}>
      <Form
        onSubmit={onSubmit}
        initialValues={props.initialValues}
        mutators={{ setFieldValue }}
      >
        {({
          handleSubmit,
          submitting,
          submitError,
          hasValidationErrors,
          form,
          values,
          invalid,
          pristine,
          ...rest
        }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            id="comments-postCommentForm-form"
          >
            <HorizontalGutter>
              <FormSpy
                onChange={(state) => {
                  return props.onChange && props.onChange(state, form);
                }}
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
                        {props.bodyLabel}
                        <div>
                          {/* TODO: placeholder for QA */}
                          <Localized
                            id={"comments-postCommentForm-rte"}
                            attrs={{ placeholder: true }}
                          >
                            <RTEContainer
                              inputID="comments-postCommentForm-field"
                              config={props.rteConfig}
                              onFocus={props.onFocus}
                              onWillPaste={onPaste}
                              onChange={(html: string) => {
                                input.onChange(html);
                              }}
                              contentClassName={
                                undefined
                                /* props.showMessageBox ? styles.rteBorderless : undefined*/
                              }
                              value={input.value}
                              placeholder="Post a comment"
                              disabled={submitting || props.disabled}
                              ref={props.rteRef || null}
                              toolbarButtons={
                                <>
                                  <Button
                                    color="mono"
                                    variant={
                                      showGifSelector ? "regular" : "flat"
                                    }
                                    onClick={onGifButtonClick}
                                    iconLeft
                                  >
                                    <ButtonIcon>add</ButtonIcon>
                                    GIF
                                  </Button>
                                </>
                              }
                            />
                          </Localized>
                        </div>
                      </HorizontalGutter>
                    </>
                  )}
                </Field>
                <Field name="embed.source">
                  {() => <input type="hidden" />}
                </Field>
                <Field name="embed.remote_id">
                  {() => <input type="hidden" />}
                </Field>
                <Field name="embed.url">
                  {(fieldProps) => (
                    <div>
                      {showGifSelector && (
                        <>
                          <GifSelector
                            onGifSelect={(gif) => {
                              form.mutators.setFieldValue(
                                "embed.source",
                                "GIPHY"
                              );
                              form.mutators.setFieldValue(
                                "embed.remote_id",
                                gif.id
                              );
                              fieldProps.input.onChange(
                                gif.images.original.url
                              );
                              setShowGifSelector(false);
                            }}
                            value={fieldProps.input.value}
                          />
                        </>
                      )}
                      {values.embed &&
                        values.embed.source === "GIPHY" &&
                        fieldProps.input.value &&
                        fieldProps.input.value.length > 0 && (
                          <GifPreview
                            url={fieldProps.input.value}
                            onRemove={() => fieldProps.input.onChange(null)}
                            title=""
                          />
                        )}
                      {embedLink && (
                        <EmbedConfirmPrompt
                          embed={embedLink}
                          onConfirm={() =>
                            confirmEmbedLink(form.mutators.setFieldValue)
                          }
                          onRemove={() => {
                            setEmbedLink(null);
                          }}
                        />
                      )}
                      {values.embed &&
                        (values.embed.source === "YOUTUBE" ||
                          values.embed.source === "TWITTER") &&
                        fieldProps.input.value &&
                        fieldProps.input.value.length > 0 && (
                          <EmbedPreview
                            embed={{
                              url: fieldProps.input.value,
                              source: values.embed.source,
                            }}
                            onRemove={() => {
                              fieldProps.input.onChange(null);
                              form.mutators.setFieldValue("embed.source", null);
                              form.mutators.setFieldValue(
                                "embed.remote_id",
                                null
                              );
                            }}
                          />
                        )}
                    </div>
                  )}
                </Field>
              </div>
              {props.expired && (
                <Localized id="comments-editCommentForm-editTimeExpired">
                  <ValidationMessage
                    className={CLASSES.editComment.expiredTime}
                  >
                    Edit time has expired. You can no longer edit this comment.
                    Why not post another one?
                  </ValidationMessage>
                </Localized>
              )}
              {!props.expired && props.editableUntil && (
                <Message
                  className={CLASSES.editComment.remainingTime}
                  fullWidth
                >
                  <MessageIcon>alarm</MessageIcon>
                  <Localized
                    id="comments-editCommentForm-editRemainingTime"
                    time={<RelativeTime date={props.editableUntil} live />}
                  >
                    <span>{"Edit: <time></time> remaining"}</span>
                  </Localized>
                </Message>
              )}
              {props.disabled ? (
                <>
                  {props.disabledMessage && (
                    <ValidationMessage>
                      {props.disabledMessage}
                    </ValidationMessage>
                  )}
                </>
              ) : (
                <Field
                  name="body"
                  subscription={{
                    touched: true,
                    error: true,
                    submitError: true,
                    value: true,
                    dirtySinceLastSubmit: true,
                  }}
                >
                  {({
                    input: { value },
                    meta: {
                      touched,
                      error,
                      submitError: localSubmitError,
                      dirtySinceLastSubmit,
                    },
                  }) => (
                    <>
                      {touched &&
                        (error ||
                          (localSubmitError && !dirtySinceLastSubmit)) && (
                          <ValidationMessage>
                            {error || submitError}
                          </ValidationMessage>
                        )}
                      {props.max && (
                        <RemainingCharactersContainer
                          value={value}
                          max={props.max}
                        />
                      )}
                    </>
                  )}
                </Field>
              )}
              {submitError && (
                <ValidationMessage>{submitError}</ValidationMessage>
              )}
              {props.submitStatus}
              <Flex justifyContent="flex-end" spacing={1}>
                <MatchMedia ltWidth="sm">
                  {(matches) => (
                    <>
                      {props.onCancel && (
                        <Localized id="comments-commentForm-cancel">
                          {/* todo: classnames */}
                          <Button
                            color="mono"
                            variant="outline"
                            disabled={submitting}
                            onClick={props.onCancel}
                            fullWidth={matches}
                            className={CLASSES.editComment.cancel}
                          >
                            Cancel
                          </Button>
                        </Localized>
                      )}
                      <Localized
                        id={
                          props.editableUntil
                            ? "comments-commentForm-saveChanges"
                            : "comments-commentForm-submit"
                        }
                      >
                        <Button
                          color="stream"
                          variant="regular"
                          disabled={
                            hasValidationErrors ||
                            submitting ||
                            props.disabled ||
                            (!!props.editableUntil && pristine)
                          }
                          type="submit"
                          fullWidth={matches}
                          className={CLASSES[props.classNameRoot].submit}
                        >
                          {props.editableUntil ? "Save changes" : "Submit"}
                        </Button>
                      </Localized>
                    </>
                  )}
                </MatchMedia>
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default CommentForm;
