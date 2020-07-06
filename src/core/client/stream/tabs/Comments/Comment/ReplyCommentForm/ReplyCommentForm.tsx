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

import {
  EmbedLink,
  findEmbedLinks,
} from "coral-framework/helpers/findEmbedLinks";
import { useViewerEvent } from "coral-framework/lib/events";
import { OnSubmit } from "coral-framework/lib/form";
import { GQLEMBED_SOURCE_RL } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import { ReplyCommentFocusEvent } from "coral-stream/events";
import {
  AriaInfo,
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  MatchMedia,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import GifSelector, { GifPreview } from "../../GifSelector";
import { getCommentBodyValidators } from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer from "../../RTE";
import EmbedConfirmation from "../EmbedConfirmation";
import ReplyTo from "./ReplyTo";

import styles from "./ReplyCommentForm.css";

export interface PasteEvent {
  fragment: DocumentFragment;
  preventDefault: () => void;
  defaultPrevented: boolean;
}

type FoundEmbedLink = EmbedLink & {
  confirmed: boolean;
  id?: string;
};

interface FormProps {
  body: string;
  embed?: EmbedLink;
}

export interface ReplyCommentFormProps {
  id: string;
  className?: string;
  onSubmit: OnSubmit<any>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onChange?: (state: FormState<any>, form: FormApi) => void;
  initialValues?: FormProps;
  rteRef?: Ref<CoralRTE>;
  parentUsername: string | null;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
}

const ReplyCommentForm: FunctionComponent<ReplyCommentFormProps> = (props) => {
  const inputID = `comments-replyCommentForm-rte-${props.id}`;
  const emitFocusEvent = useViewerEvent(ReplyCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);
  const [showGifSelector, setShowGifSelector] = useState(false);
  const onGifButtonClick = useCallback(() => {
    setShowGifSelector(!showGifSelector);
  }, [showGifSelector]);
  const [embedLink, setEmbedLink] = useState<FoundEmbedLink | null>(null);
  const [embedType, setEmbedType] = useState<GQLEMBED_SOURCE_RL | null>(null);
  const confirmEmbedLink = useCallback(() => {
    if (embedLink) {
      setEmbedLink({
        ...embedLink,
        confirmed: true,
      });
    }
  }, [embedLink]);

  const removeEmbedLink = useCallback(() => {
    setEmbedLink(null);
    setEmbedType(null);
  }, [embedLink]);
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
      setEmbedType(link.source);
      setEmbedLink({ ...link, confirmed: false });
    }
  }, []);
  const onSubmit = useCallback(
    (values, form) => {
      if (values.embed && values.embed.url && embedType === "GIPHY") {
        values.embed.source = "GIPHY";
      } else if (embedLink && embedLink.confirmed) {
        const linksInText = findEmbedLinks(values.body);
        if (
          linksInText.length > 0 &&
          linksInText.find((value) => value.url === embedLink.url)
        ) {
          values.embed = {
            url: embedLink.url,
            source: embedLink.source,
            id: embedLink.id,
          };
        }
      } else {
        delete values.embed;
      }
      setEmbedLink(null);
      return props.onSubmit(values, form);
    },
    [props.onSubmit, embedLink]
  );
  return (
    <Form onSubmit={onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, form, submitError, invalid }) => (
        <form
          className={cn(props.className, CLASSES.createReplyComment.$root)}
          autoComplete="off"
          onSubmit={handleSubmit}
          id={`comments-replyCommentForm-form-${props.id}`}
        >
          <FormSpy
            onChange={(state) => props.onChange && props.onChange(state, form)}
          />
          <HorizontalGutter>
            <div className={styles.commentFormBox}>
              <Field
                name="body"
                validate={getCommentBodyValidators(props.min, props.max, true)}
              >
                {/* FIXME: (wyattjoh) reorganize this */}
                {({ input, meta }) => (
                  <>
                    <HorizontalGutter size="half">
                      <div>
                        <Localized id="comments-replyCommentForm-rteLabel">
                          <AriaInfo component="label" htmlFor={inputID}>
                            Write a reply
                          </AriaInfo>
                        </Localized>
                        {props.parentUsername && (
                          <ReplyTo username={props.parentUsername} />
                        )}
                        <Localized
                          id="comments-replyCommentForm-rte"
                          attrs={{ placeholder: true }}
                        >
                          <RTEContainer
                            config={props.rteConfig}
                            inputID={inputID}
                            onFocus={onFocus}
                            onChange={(html) => input.onChange(html)}
                            value={input.value}
                            placeholder="Write a reply"
                            onWillPaste={onPaste}
                            ref={props.rteRef}
                            disabled={submitting || props.disabled}
                            contentClassName={styles.rteContent}
                            toolbarButtons={
                              <>
                                <Button
                                  color="mono"
                                  variant={showGifSelector ? "regular" : "flat"}
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
                      <GifSelector
                        onGifSelect={(gif) => {
                          fieldProps.input.onChange(gif.images.original.url);
                          setEmbedType("GIPHY");
                          setShowGifSelector(false);
                        }}
                        value={fieldProps.input.value}
                      />
                    )}
                    {embedType === "GIPHY" &&
                      fieldProps.input.value &&
                      fieldProps.input.value.length > 0 && (
                        <GifPreview
                          url={fieldProps.input.value}
                          onRemove={() => {
                            fieldProps.input.onChange(null);
                            setEmbedType(null);
                          }}
                          title=""
                        />
                      )}
                    {embedLink && (
                      <EmbedConfirmation
                        embed={embedLink}
                        onConfirm={confirmEmbedLink}
                        onRemove={() => {
                          fieldProps.input.onChange(null);
                          removeEmbedLink();
                          setEmbedType(null);
                        }}
                      />
                    )}
                  </div>
                )}
              </Field>
            </div>

            <MatchMedia ltWidth="sm">
              {(matches) => (
                <Flex
                  direction="row"
                  justifyContent="flex-end"
                  itemGutter="half"
                >
                  <Localized id="comments-replyCommentForm-cancel">
                    <Button
                      color="mono"
                      variant="outline"
                      disabled={submitting}
                      onClick={props.onCancel}
                      className={CLASSES.createReplyComment.cancel}
                      fullWidth={matches}
                    >
                      Cancel
                    </Button>
                  </Localized>
                  <Localized id="comments-replyCommentForm-submit">
                    <Button
                      color="stream"
                      variant="regular"
                      disabled={submitting || invalid || props.disabled}
                      type="submit"
                      className={CLASSES.createReplyComment.submit}
                      fullWidth={matches}
                    >
                      Submit
                    </Button>
                  </Localized>
                </Flex>
              )}
            </MatchMedia>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default ReplyCommentForm;
