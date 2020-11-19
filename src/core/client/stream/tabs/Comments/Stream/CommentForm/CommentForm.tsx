import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi, FormState } from "final-form";
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  Ref,
  useCallback,
  useState,
} from "react";
import { Field, Form, FormSpy } from "react-final-form";

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
import MediaField, { Widget } from "./MediaField";

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

interface FormProps {
  body: string;
  media?: MediaProps;
}

interface FormSubmitProps extends FormProps, FormError {}

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
  mediaConfig: MediaConfig;
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

const CommentForm: FunctionComponent<Props> = (props) => {
  const [mediaWidget, setMediaWidget] = useState<Widget>(null);
  const [pastedMedia, setPastedMedia] = useState<MediaLink | null>(null);
  const { onSubmit, mediaConfig } = props;
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
    <div className={cn(CLASSES[props.classNameRoot].$root, props.className)}>
      <Form onSubmit={onFormSubmit} initialValues={props.initialValues}>
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
            <HorizontalGutter>
              <FormSpy
                onChange={(state) => {
                  return props.onChange && props.onChange(state, form);
                }}
              />
              <div>
                {props.bodyLabel}
                <div
                  className={cn(
                    styles.commentFormBox,
                    {
                      [styles.noTopBorder]: !props.topBorder,
                    },
                    CLASSES.commentForm
                  )}
                >
                  <Field
                    name="body"
                    validate={getCommentBodyValidators(props.min, props.max)}
                  >
                    {({ input }) => (
                      <Localized
                        id={props.placeHolderId}
                        attrs={{ placeholder: true }}
                      >
                        <RTEContainer
                          inputID={props.bodyInputID}
                          config={props.rteConfig}
                          onFocus={props.onFocus}
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
                          value={input.value}
                          placeholder={props.placeholder}
                          disabled={submitting || props.disabled}
                          ref={props.rteRef || null}
                          toolbarButtons={
                            <>
                              {props.mediaConfig &&
                              props.mediaConfig.external.enabled ? (
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
                              {props.mediaConfig &&
                              props.mediaConfig.giphy.enabled ? (
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
                    siteID={props.siteID}
                    giphyConfig={props.mediaConfig.giphy}
                  />
                </div>
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
                    <CallOut
                      className={CLASSES.editComment.expiredTime}
                      color="error"
                      title={props.disabledMessage}
                      titleWeight="semiBold"
                      icon={<Icon>error</Icon>}
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
                          />
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
                <CallOut
                  color="error"
                  title={submitError}
                  titleWeight="semiBold"
                  icon={<Icon>error</Icon>}
                />
              )}
              <Flex justifyContent="flex-end" spacing={1}>
                <MatchMedia ltWidth="sm">
                  {(matches) => (
                    <>
                      {props.onCancel && (
                        <Localized id="comments-commentForm-cancel">
                          <Button
                            color="secondary"
                            variant="outlined"
                            disabled={submitting}
                            onClick={props.onCancel}
                            fullWidth={matches}
                            className={CLASSES[props.classNameRoot].cancel}
                            upperCase
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
                          color="primary"
                          variant="filled"
                          disabled={
                            hasValidationErrors ||
                            submitting ||
                            props.disabled ||
                            (!!props.editableUntil && pristine)
                          }
                          type="submit"
                          fullWidth={matches}
                          className={CLASSES[props.classNameRoot].submit}
                          upperCase
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

CommentForm.defaultProps = {
  topBorder: true,
};

export default CommentForm;
