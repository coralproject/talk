import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi, FormState, FormSubscription } from "final-form";
import React, {
  EventHandler,
  FocusEvent,
  FunctionComponent,
  MouseEvent,
  Ref,
  useCallback,
  useRef,
  useState,
} from "react";
import { Field, Form } from "react-final-form";

import { findMediaLinks, MediaLink } from "coral-common/helpers/findMediaLinks";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import {
  Flex,
  HorizontalGutter,
  Icon,
  MatchMedia,
} from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";
import useStyles from "coral-ui/hooks/useStyles";

import { getCommentBodyValidators } from "../../../shared/helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer, { RTEButton } from "../../RTE";
import { RTELocalized } from "../../RTE/RTE";
import { RTEFeatureOverrides } from "../../RTE/RTEContainer";
import FormSync from "./FormSync";
import MediaField, { Widget } from "./MediaField";
import RatingInput from "./RatingInput";

import styles from "./CommentForm.css";

export interface PasteEvent {
  fragment: DocumentFragment;
  preventDefault: () => void;
  defaultPrevented: boolean;
}

interface MediaProps {
  type: "giphy" | "twitter" | "youtube" | "external";
  url: string;
  id: string | null;
  width?: string;
  height?: string;
}

interface MediaConfig {
  giphy: {
    enabled: boolean;
    key: string | null;
    maxRating: string | null;
  };
  twitter: {
    enabled: boolean;
  };
  youtube: {
    enabled: boolean;
  };
  external: {
    enabled: boolean;
  };
}

export type OnChangeHandler = (
  state: FormState<FormProps, Partial<FormProps>>,
  form: FormApi<FormProps>
) => void;
export type OnSubmitHandler = OnSubmit<FormSubmitProps>;

export interface FormProps {
  body: string;
  rating?: number;
  media?: MediaProps;
}

interface FormSubmitProps extends FormProps, FormError {}

interface Props {
  onSubmit: OnSubmitHandler;
  onChange?: OnChangeHandler;
  initialValues?: FormProps;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  bodyLabel: React.ReactNode;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  rteRef?: Ref<CoralRTE>;
  onCancel?: EventHandler<MouseEvent<any>>;
  message?: React.ReactNode;
  submitStatus?: React.ReactNode;
  mediaConfig: MediaConfig;
  mode?: "rating" | "comment" | "chat";
  placeholder: string;
  bodyInputID: string;
  siteID: string;
  topBorder?: boolean;
  className?: string;
  classes?: Partial<typeof styles>;
  focusAfterSubmit?: boolean;
  autoHideToolbar?: boolean;
  autoFocus?: boolean;
  noSubmitWhenPristine?: boolean;
  submitButtonContent?: React.ReactNode;
  submitButtonTitle?: string;
  featureOverrides?: RTEFeatureOverrides;
}

function createWidgetToggle(desiredWidget: Widget) {
  return (widget: Widget) => {
    if (widget !== desiredWidget) {
      return desiredWidget;
    }

    return null;
  };
}

const subscription: FormSubscription = {
  dirty: true,
  values: true,
  touched: true,
};

const ErrorCallout: FunctionComponent<{ error: any; className?: string }> = ({
  error,
  className,
}) => (
  <CallOut
    className={className}
    color="error"
    title={error}
    titleWeight="semiBold"
    icon={<Icon>error</Icon>}
  />
);

const CommentForm: FunctionComponent<Props> = ({
  bodyInputID,
  bodyLabel,
  className,
  disabled = false,
  disabledMessage,
  message,
  submitButtonContent,
  submitButtonTitle,
  initialValues,
  max,
  mediaConfig,
  min,
  mode = "comment",
  onCancel,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
  placeholder,
  rteConfig,
  rteRef,
  siteID,
  submitStatus,
  topBorder,
  autoHideToolbar,
  focusAfterSubmit,
  autoFocus,
  classes,
  noSubmitWhenPristine,
  featureOverrides,
}) => {
  const myRTERef = useRef<CoralRTE | null>(null);
  const [mediaWidget, setMediaWidget] = useState<Widget>(null);
  const [pastedMedia, setPastedMedia] = useState<MediaLink | null>(null);

  const setRTERef = useCallback(
    (ref: CoralRTE | null) => {
      if (rteRef) {
        if (ref && autoFocus) {
          ref.focus();
        }
        if ("current" in rteRef) {
          (rteRef as any).current = ref;
        } else {
          rteRef(ref);
        }
        myRTERef.current = ref;
      }
    },
    [autoFocus, rteRef]
  );
  const onFormSubmit = useCallback(
    async (values: FormSubmitProps, form: FormApi) => {
      // Unset the media.
      setPastedMedia(null);

      // Submit the form.
      const result = await onSubmit(values, form);
      if (focusAfterSubmit) {
        // @cvle: Verified that this doesn't need a `clearTimeout` :-)
        setTimeout(() => {
          if (myRTERef.current) {
            myRTERef.current.focus();
          }
        }, 100);
      }
      return result;
    },
    [onSubmit, setPastedMedia, focusAfterSubmit]
  );

  const onBodyChange = useCallback(
    (html: string, values: FormProps, form: FormApi) => {
      if (pastedMedia || values.media) {
        const existingLink =
          values.media && values.media.url ? values.media : pastedMedia;
        // if there is a pending or selected twitter or youtube url
        if (
          existingLink &&
          (existingLink.type === "twitter" || existingLink.type === "youtube")
        ) {
          const links = findMediaLinks(html);
          // ensure the text still contains the link
          const match = links.find((l) => l.url === existingLink?.url);
          if (!match) {
            // check if the text contains another link
            const otherLink = links.find((l) => l.url !== existingLink?.url);
            if (otherLink) {
              // prompt user to confirm the other link
              setPastedMedia(otherLink);
            } else {
              // clear pasted media
              setPastedMedia(null);
            }
            // clear form field
            form.change("media", null);
          }
        }
      }
    },
    [setPastedMedia, pastedMedia]
  );

  const onPaste = useCallback(
    (event: PasteEvent) => {
      const children = event.fragment.children;
      let link = null;
      for (let i = 0; i < children.length; i++) {
        const item = children.item(i);
        if (item && item.textContent) {
          const links = findMediaLinks(item.textContent);
          if (links.length > 0) {
            link = links[0];
            break;
          }
        }
      }
      if (
        link &&
        mediaConfig &&
        ((link.type === "twitter" && mediaConfig.twitter.enabled) ||
          (link.type === "youtube" && mediaConfig.youtube.enabled))
      ) {
        setPastedMedia({ ...link });
      }
    },
    [setPastedMedia, mediaConfig]
  );

  /* Handle showing toolbar */
  const currentBodyRef = useRef("");
  const [showToolbar, setShowToolbar] = useState(!autoHideToolbar);
  const [rteFocus, setRTEFocus] = useState(false);
  const handleOnChange: OnChangeHandler = useCallback(
    (state, form) => {
      // Track current body value to determine wheter or not we want to
      // auto hide the toolbar if enabled.
      currentBodyRef.current = state.values.body;
      if (onChange) {
        return onChange(state, form);
      }
    },
    [onChange]
  );
  const rteOnFocus = useCallback(
    (event: React.FocusEvent<Element>) => {
      if (onFocus) {
        onFocus(event);
      }
      setRTEFocus(true);
      if (!autoHideToolbar) {
        return;
      }
      setShowToolbar(true);
    },
    [autoHideToolbar, onFocus]
  );
  const rteOnBlur = useCallback(
    (event: React.FocusEvent<Element>) => {
      if (onBlur) {
        onBlur(event);
      }
      setRTEFocus(false);
      if (!autoHideToolbar) {
        return;
      }
    },
    [autoHideToolbar, onBlur]
  );

  const toggleExternalImageInput = useCallback(() => {
    setMediaWidget(createWidgetToggle("external"));
  }, []);

  const toggleGIFSelector = useCallback(() => {
    setMediaWidget(createWidgetToggle("giphy"));
  }, []);

  const showGifSelector = mediaWidget === "giphy";
  const showExternalImageInput = mediaWidget === "external";

  const css = useStyles(styles, classes);

  return (
    <div className={cn(className, css.root)}>
      <Form onSubmit={onFormSubmit} initialValues={initialValues}>
        {({
          handleSubmit,
          submitting,
          submitError,
          hasValidationErrors,
          form,
          pristine,
          values,
        }) => {
          const disabledMessageElement = disabledMessage && (
            <ErrorCallout
              error={disabledMessage}
              className={css.disabledMessage}
            />
          );
          const rteElement = (
            <div
              className={cn(
                css.commentFormBox,
                {
                  [css.noTopBorder]: !topBorder,
                  [css.rteFocus]: rteFocus && mode === "chat",
                },
                CLASSES.commentForm
              )}
            >
              <Field name="body" validate={getCommentBodyValidators(min, max)}>
                {({ input }) => (
                  <RTEContainer
                    inputID={bodyInputID}
                    config={rteConfig}
                    onFocus={rteOnFocus}
                    onBlur={rteOnBlur}
                    contentClassName={cn(css.content, {
                      [css.chatContent]: mode === "chat",
                    })}
                    onWillPaste={(event) => {
                      if (
                        !(
                          (values as FormProps).media &&
                          (values as FormProps).media?.url
                        )
                      ) {
                        onPaste(event);
                      }
                    }}
                    onChange={(html: string) => {
                      input.onChange(html);
                      onBodyChange(html, values as FormProps, form);
                    }}
                    onKeyDown={(event: React.KeyboardEvent<Element>) => {
                      if (
                        hasValidationErrors ||
                        submitting ||
                        disabled ||
                        (noSubmitWhenPristine && pristine)
                      ) {
                        return;
                      }
                      if (
                        (mode === "chat" || event.ctrlKey) &&
                        !event.shiftKey &&
                        (event.key === "Enter" || event.keyCode === 13)
                      ) {
                        void handleSubmit();
                        event.preventDefault();
                      }
                    }}
                    value={input.value}
                    placeholder={placeholder}
                    disabled={submitting || disabled}
                    ref={setRTERef}
                    showToolbar={showToolbar}
                    toolbarButtons={
                      <>
                        {mediaConfig && mediaConfig.external.enabled ? (
                          <RTELocalized
                            key="image"
                            id="comments-rte-externalImage"
                            attrs={{ title: true }}
                          >
                            <RTEButton
                              disabled={
                                !!pastedMedia ||
                                !!(
                                  (values as FormProps).media &&
                                  (values as FormProps).media?.url
                                )
                              }
                              aria-pressed={showExternalImageInput}
                              onClick={toggleExternalImageInput}
                            >
                              <Icon size="md">add_photo_alternate</Icon>
                            </RTEButton>
                          </RTELocalized>
                        ) : null}
                        {mediaConfig && mediaConfig.giphy.enabled ? (
                          <RTEButton
                            key="gif"
                            disabled={
                              !!pastedMedia ||
                              !!(
                                (values as FormProps).media &&
                                (values as FormProps).media?.url
                              )
                            }
                            aria-pressed={showGifSelector}
                            onClick={toggleGIFSelector}
                          >
                            <Flex alignItems="center" container="span">
                              <Icon className={css.icon}>add</Icon>
                              GIF
                            </Flex>
                          </RTEButton>
                        ) : null}
                      </>
                    }
                    featureOverrides={featureOverrides}
                  />
                )}
              </Field>
              <MediaField
                widget={mediaWidget}
                setWidget={setMediaWidget}
                pastedMedia={pastedMedia}
                setPastedMedia={setPastedMedia}
                siteID={siteID}
                giphyConfig={mediaConfig.giphy}
              />
            </div>
          );
          const chatButtonElement = mode === "chat" && (
            <Button
              color="primary"
              variant="filled"
              disabled={
                hasValidationErrors ||
                submitting ||
                disabled ||
                (noSubmitWhenPristine && pristine)
              }
              type="submit"
              className={cn(css.chatSubmitButton, {
                [css.chatSubmitButtonWithToolbar]: showToolbar,
              })}
              title={submitButtonTitle}
            >
              <Icon>send</Icon>
            </Button>
          );
          const submitErrorElement = !disabled && submitError && (
            <ErrorCallout error={submitError} />
          );
          const formButtonsElement = mode !== "chat" && (
            <Flex justifyContent="flex-end" spacing={1}>
              <MatchMedia ltWidth="sm">
                {(matches) => (
                  <>
                    {onCancel && (
                      <Localized id="comments-commentForm-cancel">
                        <Button
                          color="secondary"
                          variant="outlined"
                          disabled={submitting}
                          onClick={onCancel}
                          fullWidth={matches}
                          className={css.cancelButton}
                          upperCase
                        >
                          Cancel
                        </Button>
                      </Localized>
                    )}
                    <Button
                      color="primary"
                      variant="filled"
                      disabled={
                        hasValidationErrors ||
                        submitting ||
                        disabled ||
                        (noSubmitWhenPristine && pristine)
                      }
                      type="submit"
                      fullWidth={matches}
                      className={css.submitButton}
                      title={submitButtonTitle}
                      upperCase
                    >
                      {submitButtonContent}
                    </Button>
                  </>
                )}
              </MatchMedia>
            </Flex>
          );
          const remainingCharactersElement = (
            <Field
              name="body"
              subscription={{
                value: true,
              }}
            >
              {({ input: { value } }) =>
                (max && (
                  <RemainingCharactersContainer value={value} max={max} />
                )) ||
                null
              }
            </Field>
          );
          const bodyErrorElement = (
            <Field
              name="body"
              subscription={{
                touched: true,
                error: true,
                submitError: true,
                dirtySinceLastSubmit: true,
              }}
            >
              {({
                meta: {
                  touched,
                  error,
                  submitError: localSubmitError,
                  dirtySinceLastSubmit,
                },
              }) =>
                (touched &&
                  (error || (localSubmitError && !dirtySinceLastSubmit)) && (
                    <ErrorCallout error={error || localSubmitError} />
                  )) ||
                null
              }
            </Field>
          );

          return (
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              id="comments-postCommentForm-form"
            >
              {mode === "rating" && (
                <RatingInput disabled={submitting || disabled} />
              )}
              <HorizontalGutter>
                <FormSync
                  onChange={handleOnChange}
                  subscription={subscription}
                />
                {mode === "chat" && (
                  <>
                    {disabled ? disabledMessageElement : bodyErrorElement}
                    {submitErrorElement}
                    {formButtonsElement}
                    {submitStatus}
                  </>
                )}
                <div className={css.rteContainer}>
                  {bodyLabel}
                  {rteElement}
                  {mode === "chat" && chatButtonElement}
                </div>
                {mode !== "chat" && (
                  <>
                    {message}
                    {disabled ? (
                      disabledMessageElement
                    ) : (
                      <>
                        {bodyErrorElement}
                        {remainingCharactersElement}
                      </>
                    )}
                    {submitErrorElement}
                    {formButtonsElement}
                    {submitStatus}
                  </>
                )}
                {mode === "chat" && (
                  <>
                    {message}
                    {!disabled && remainingCharactersElement}
                  </>
                )}
              </HorizontalGutter>
            </form>
          );
        }}
      </Form>
    </div>
  );
};

CommentForm.defaultProps = {
  topBorder: true,
  submitButtonContent: (
    <Localized id="comments-commentForm-submit">Submit</Localized>
  ),
};

export default CommentForm;
