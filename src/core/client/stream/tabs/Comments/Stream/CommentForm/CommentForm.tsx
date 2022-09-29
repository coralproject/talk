import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi, FormState, FormSubscription } from "final-form";
import React, {
  CSSProperties,
  EventHandler,
  FunctionComponent,
  MouseEvent,
  Ref,
  useCallback,
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
  Message,
  MessageIcon,
  RelativeTime,
} from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { getCommentBodyValidators } from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer, { RTEButton } from "../../RTE";
import { RTELocalized } from "../../RTE/RTE";
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
  onFocus?: () => void;
  rteRef?: Ref<CoralRTE>;
  onCancel?: EventHandler<MouseEvent<any>>;
  editableUntil?: string;
  expired?: boolean;
  submitStatus?: React.ReactNode;
  classNameRoot: "createComment" | "editComment" | "createReplyComment";
  mediaConfig: MediaConfig;
  mode?: "rating" | "comment";
  placeholder: string;
  placeHolderId: string;
  bodyInputID: string;
  siteID: string;
  topBorder?: boolean;
  className?: string;
}

function createWidgetToggle(desiredWidget: Widget) {
  return (widget: Widget) => {
    if (widget !== desiredWidget) {
      return desiredWidget;
    }

    return null;
  };
}

/** hiddenStyle is used to hide the form while the RTE is still being loaded. */
const hiddenStyle: CSSProperties = {
  opacity: 0,
  position: "absolute",
  width: "100%",
  pointerEvents: "none",
};

const subscription: FormSubscription = {
  dirty: true,
  values: true,
  touched: true,
};

const CommentForm: FunctionComponent<Props> = ({
  bodyInputID,
  bodyLabel,
  className,
  classNameRoot,
  disabled = false,
  disabledMessage,
  editableUntil,
  expired,
  initialValues,
  max,
  mediaConfig,
  min,
  mode = "comment",
  onCancel,
  onChange,
  onFocus,
  onSubmit,
  placeholder,
  placeHolderId,
  rteConfig,
  rteRef,
  siteID,
  submitStatus,
  topBorder,
}) => {
  const [rteLoaded, setRTELoaded] = useState(false);
  const [mediaWidget, setMediaWidget] = useState<Widget>(null);
  const [pastedMedia, setPastedMedia] = useState<MediaLink | null>(null);

  const onRTELoad = useCallback(() => {
    setRTELoaded(true);
  }, []);

  const onFormSubmit = useCallback(
    (values: FormSubmitProps, form: FormApi) => {
      // Unset the media.
      setPastedMedia(null);

      // Submit the form.
      return onSubmit(values, form);
    },
    [onSubmit, setPastedMedia]
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

  const toggleExternalImageInput = useCallback(() => {
    setMediaWidget(createWidgetToggle("external"));
  }, []);

  const toggleGIFSelector = useCallback(() => {
    setMediaWidget(createWidgetToggle("giphy"));
  }, []);

  const showGifSelector = mediaWidget === "giphy";
  const showExternalImageInput = mediaWidget === "external";

  return (
    <div
      className={cn(CLASSES[classNameRoot].$root, className)}
      style={rteLoaded ? undefined : hiddenStyle}
    >
      <Form onSubmit={onFormSubmit} initialValues={initialValues}>
        {({
          handleSubmit,
          submitting,
          submitError,
          hasValidationErrors,
          form,
          pristine,
          values,
        }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            id="comments-postCommentForm-form"
          >
            {mode === "rating" && (
              <RatingInput disabled={submitting || disabled} />
            )}
            <HorizontalGutter>
              {onChange && (
                <FormSync onChange={onChange} subscription={subscription} />
              )}
              <div>
                {bodyLabel}
                <div
                  className={cn(
                    styles.commentFormBox,
                    {
                      [styles.noTopBorder]: !topBorder,
                    },
                    CLASSES.commentForm
                  )}
                >
                  <Field
                    name="body"
                    validate={getCommentBodyValidators(min, max)}
                  >
                    {({ input }) => (
                      <Localized
                        id={placeHolderId}
                        attrs={{ placeholder: true }}
                      >
                        <RTEContainer
                          inputID={bodyInputID}
                          config={rteConfig}
                          onFocus={onFocus}
                          onLoad={onRTELoad}
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
                          onKeyPress={async (
                            event: React.KeyboardEvent<Element>
                          ) => {
                            if (
                              event.ctrlKey &&
                              (event.key === "Enter" || event.keyCode === 13)
                            ) {
                              await onFormSubmit(values as any, form);
                            }
                          }}
                          value={input.value}
                          placeholder={placeholder}
                          disabled={submitting || disabled}
                          ref={rteRef || null}
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
                                    <Icon className={styles.icon}>add</Icon>
                                    GIF
                                  </Flex>
                                </RTEButton>
                              ) : null}
                            </>
                          }
                        />
                      </Localized>
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
              </div>
              {!expired && editableUntil && (
                <Message
                  className={CLASSES.editComment.remainingTime}
                  fullWidth
                >
                  <MessageIcon>alarm</MessageIcon>
                  <Localized
                    id="comments-editCommentForm-editRemainingTime"
                    elems={{ time: <RelativeTime date={editableUntil} live /> }}
                  >
                    <span>{"Edit: <time></time> remaining"}</span>
                  </Localized>
                </Message>
              )}
              {disabled ? (
                <>
                  {disabledMessage && (
                    <CallOut
                      className={CLASSES.editComment.expiredTime}
                      color="error"
                      title={disabledMessage}
                      titleWeight="semiBold"
                      icon={<Icon>error</Icon>}
                      role="alert"
                    />
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
                          <CallOut
                            color="error"
                            title={error || localSubmitError}
                            titleWeight="semiBold"
                            icon={<Icon>error</Icon>}
                            role="alert"
                          />
                        )}
                      {max && (
                        <RemainingCharactersContainer value={value} max={max} />
                      )}
                    </>
                  )}
                </Field>
              )}
              {/* Only show the submit error when the stream hasn't been disabled */}
              {!disabled && submitError && (
                <CallOut
                  color="error"
                  title={submitError}
                  titleWeight="semiBold"
                  icon={<Icon>error</Icon>}
                  role="alert"
                />
              )}
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
                            className={CLASSES[classNameRoot].cancel}
                            upperCase
                          >
                            Cancel
                          </Button>
                        </Localized>
                      )}
                      <Localized
                        id={
                          editableUntil
                            ? "comments-commentForm-saveChanges"
                            : "comments-commentForm-submit"
                        }
                      >
                        <Button
                          color="primary"
                          variant="filled"
                          disabled={
                            hasValidationErrors ||
                            submitting ||
                            disabled ||
                            (!!editableUntil && pristine)
                          }
                          type="submit"
                          fullWidth={matches}
                          className={CLASSES[classNameRoot].submit}
                          upperCase
                        >
                          {editableUntil ? "Save changes" : "Submit"}
                        </Button>
                      </Localized>
                    </>
                  )}
                </MatchMedia>
              </Flex>
              {submitStatus}
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

CommentForm.defaultProps = {
  topBorder: true,
};

export default CommentForm;
