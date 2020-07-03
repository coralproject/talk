import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  Ref,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Field, Form } from "react-final-form";

import { EmbedLink, findEmbedLinks } from "coral-common/utils/findEmbedLinks";
import { OnSubmit } from "coral-framework/lib/form";
import { GQLEMBED_SOURCE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import Timestamp from "coral-stream/common/Timestamp";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import {
  AriaInfo,
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  MatchMedia,
  Message,
  MessageIcon,
  RelativeTime,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import GifSelector, { GifPreview } from "../../GifSelector";
import { getCommentBodyValidators } from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer from "../../RTE";
import EmbedConfirmation from "../EmbedConfirmation";
import TopBarLeft from "../TopBarLeft";
import Username from "../Username";

import styles from "./EditCommentForm.css";

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
  embed: EmbedLink | null;
}

export interface EditCommentFormProps {
  id: string;
  className?: string;
  author: {
    username: string | null;
  } | null;
  createdAt: string;
  editableUntil: string;
  onSubmit: OnSubmit<any>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onClose?: EventHandler<MouseEvent<any>>;
  initialValues?: FormProps;
  rteRef?: Ref<CoralRTE>;
  expired?: boolean;
  min: number | null;
  max: number | null;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
}

const EditCommentForm: FunctionComponent<EditCommentFormProps> = (props) => {
  const inputID = `comments-editCommentForm-rte-${props.id}`;

  const [showGifSelector, setShowGifSelector] = useState(false);
  const onGifButtonClick = useCallback(() => {
    setShowGifSelector(!showGifSelector);
  }, [showGifSelector]);
  const [embedLink, setEmbedLink] = useState<FoundEmbedLink | null>(null);
  const [embedType, setEmbedType] = useState<GQLEMBED_SOURCE | null>(null);
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

  useEffect(() => {
    if (props.initialValues && props.initialValues.embed) {
      setEmbedLink({
        ...props.initialValues.embed,
        confirmed: true,
      });
      setEmbedType(props.initialValues.embed.source);
    }
  }, [props.initialValues]);

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
      if (
        values.embed &&
        values.embed.url &&
        embedType === GQLEMBED_SOURCE.GIPHY
      ) {
        values.embed = {
          ...values.embed,
          source: GQLEMBED_SOURCE.GIPHY,
        };
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
      void props.onSubmit(values, form);
      setEmbedLink(null);
    },
    [props.onSubmit, embedLink]
  );
  return (
    <Form onSubmit={onSubmit} initialValues={props.initialValues}>
      {({
        handleSubmit,
        submitting,
        pristine,
        submitError,
        invalid,
        values,
      }) => (
        <form
          className={cn(props.className, CLASSES.editComment.$root)}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <HorizontalGutter>
            <div>
              <TopBarLeft>
                {props.author && props.author.username && (
                  <div>
                    <Username>{props.author.username}</Username>
                  </div>
                )}
                <Timestamp>{props.createdAt}</Timestamp>
              </TopBarLeft>
            </div>
            <div className={styles.commentFormBox}>
              <Field
                name="body"
                validate={getCommentBodyValidators(props.min, props.max, true)}
              >
                {/* FIXME: (wyattjoh) reorganize this */}
                {({ input, meta }) => (
                  <>
                    <HorizontalGutter size="half">
                      <Localized id="comments-editCommentForm-rteLabel">
                        <AriaInfo component="label" htmlFor={inputID}>
                          Edit comment
                        </AriaInfo>
                      </Localized>
                      <Localized
                        id="comments-editCommentForm-rte"
                        attrs={{ placeholder: true }}
                      >
                        <RTEContainer
                          config={props.rteConfig}
                          inputID={inputID}
                          onChange={(html) => input.onChange(html)}
                          value={input.value}
                          placeholder="Edit comment"
                          ref={props.rteRef}
                          onWillPaste={onPaste}
                          disabled={submitting || props.expired}
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
                      {props.expired ? (
                        <Localized id="comments-editCommentForm-editTimeExpired">
                          <ValidationMessage
                            className={CLASSES.editComment.expiredTime}
                          >
                            Edit time has expired. You can no longer edit this
                            comment. Why not post another one?
                          </ValidationMessage>
                        </Localized>
                      ) : (
                        <>
                          <Message
                            className={CLASSES.editComment.remainingTime}
                            fullWidth
                          >
                            <MessageIcon>alarm</MessageIcon>
                            <Localized
                              id="comments-editCommentForm-editRemainingTime"
                              time={
                                <RelativeTime date={props.editableUntil} live />
                              }
                            >
                              <span>{"Edit: <time></time> remaining"}</span>
                            </Localized>
                          </Message>
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
                          setEmbedType(GQLEMBED_SOURCE.GIPHY);
                          setShowGifSelector(false);
                        }}
                        value={fieldProps.input.value}
                      />
                    )}
                    {embedType === GQLEMBED_SOURCE.GIPHY &&
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
            <Flex direction="row" justifyContent="flex-end" itemGutter="half">
              {props.expired ? (
                <Localized id="comments-editCommentForm-close">
                  <Button
                    variant="outline"
                    disabled={submitting}
                    onClick={props.onClose}
                    className={CLASSES.editComment.close}
                  >
                    Close
                  </Button>
                </Localized>
              ) : (
                <MatchMedia ltWidth="sm">
                  {(matches) => (
                    <>
                      <Localized id="comments-editCommentForm-cancel">
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
                      <Localized id="comments-editCommentForm-saveChanges">
                        <Button
                          color="stream"
                          variant="regular"
                          disabled={submitting || pristine || invalid}
                          type="submit"
                          fullWidth={matches}
                          className={CLASSES.editComment.submit}
                        >
                          Save Changes
                        </Button>
                      </Localized>
                    </>
                  )}
                </MatchMedia>
              )}
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default EditCommentForm;
