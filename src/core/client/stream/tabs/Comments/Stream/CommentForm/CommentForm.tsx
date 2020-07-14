import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
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

import { EmbedLink, findEmbedLinks } from "coral-common/helpers/findEmbedLinks";
import { FormError, OnSubmit } from "coral-framework/lib/form";
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

interface EmbedProps {
  type: "giphy" | "twitter" | "youtube";
  url: string;
  remoteID: string | null;
}

interface FormProps {
  body: string;
  embed?: EmbedProps;
}

interface FormSubmitProps extends FormProps, FormError {}

interface EmbedConfig {
  giphy: {
    enabled: boolean;
  };
  twitter: {
    enabled: boolean;
  };
  youtube: {
    enabled: boolean;
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
  bodyLabel: React.ReactNode;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
  onFocus?: () => void;
  rteRef?: Ref<CoralRTE>;
  onCancel?: EventHandler<MouseEvent<any>>;
  editableUntil?: string;
  expired?: boolean;
  submitStatus?: React.ReactNode;
  classNameRoot: "createComment" | "editComment" | "createReplyComment";
  embedConfig: EmbedConfig | null;
  placeholder: string;
  placeHolderId: string;
  bodyInputID: string;
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
    if (
      link &&
      props.embedConfig &&
      ((link.type === "twitter" &&
        props.embedConfig.twitter &&
        props.embedConfig.twitter.enabled) ||
        (link.type === "youtube" &&
          props.embedConfig.youtube &&
          props.embedConfig.youtube.enabled))
    ) {
      setEmbedLink({ ...link });
    }
  }, []);

  const confirmEmbedLink = useCallback(
    (setField: (name: string, value: string) => void) => {
      if (embedLink) {
        setField("embed.url", embedLink.url);
        setField("embed.type", embedLink.type);
        setEmbedLink(null);
      }
    },
    [embedLink]
  );

  return (
    <div className={CLASSES[props.classNameRoot].$root}>
      <Form
        onSubmit={props.onSubmit}
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
                          <Localized
                            id={props.placeHolderId}
                            attrs={{ placeholder: true }}
                          >
                            <RTEContainer
                              inputID={props.bodyInputID}
                              config={props.rteConfig}
                              onFocus={props.onFocus}
                              onWillPaste={onPaste}
                              onChange={(html: string) => {
                                input.onChange(html);
                              }}
                              value={input.value}
                              placeholder={props.placeholder}
                              disabled={submitting || props.disabled}
                              ref={props.rteRef || null}
                              toolbarButtons={
                                props.embedConfig &&
                                props.embedConfig.giphy &&
                                props.embedConfig.giphy.enabled ? (
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
                                ) : null
                              }
                            />
                          </Localized>
                        </div>
                      </HorizontalGutter>
                    </>
                  )}
                </Field>
                <Field name="embed.type">{() => <input type="hidden" />}</Field>
                <Field name="embed.remoteID">
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
                                "embed.type",
                                "giphy"
                              );
                              form.mutators.setFieldValue(
                                "embed.remoteID",
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
                        values.embed.type === "giphy" &&
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
                        (values.embed.type === "youtube" ||
                          values.embed.type === "twitter") &&
                        fieldProps.input.value &&
                        fieldProps.input.value.length > 0 && (
                          <EmbedPreview
                            config={props.embedConfig}
                            embed={{
                              url: fieldProps.input.value,
                              type: values.embed.type,
                            }}
                            onRemove={() => {
                              fieldProps.input.onChange(null);
                              form.mutators.setFieldValue("embed.type", null);
                              form.mutators.setFieldValue(
                                "embed.remoteID",
                                null
                              );
                            }}
                          />
                        )}
                    </div>
                  )}
                </Field>
              </div>
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
                            {error || localSubmitError}
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
              <Flex justifyContent="flex-end" spacing={1}>
                <MatchMedia ltWidth="sm">
                  {(matches) => (
                    <>
                      {props.onCancel && (
                        <Localized id="comments-commentForm-cancel">
                          <Button
                            color="mono"
                            variant="outline"
                            disabled={submitting}
                            onClick={props.onCancel}
                            fullWidth={matches}
                            className={CLASSES[props.classNameRoot].cancel}
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
              {props.submitStatus}
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default CommentForm;
