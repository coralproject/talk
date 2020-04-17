import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { EventHandler, FunctionComponent, MouseEvent, Ref } from "react";
import { Field, Form } from "react-final-form";

import { OnSubmit } from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import Timestamp from "coral-stream/common/Timestamp";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  MatchMedia,
  Message,
  MessageIcon,
  RelativeTime,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import {
  getCommentBodyValidators,
  getHTMLCharacterLength,
} from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer from "../../RTE";
import TopBarLeft from "../TopBarLeft";
import Username from "../Username";

interface FormProps {
  body: string;
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
  return (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, pristine, submitError }) => (
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
            <Field
              name="body"
              validate={getCommentBodyValidators(props.min, props.max)}
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
                        disabled={submitting || props.expired}
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
                  <Flex
                    direction="row"
                    justifyContent="flex-end"
                    itemGutter="half"
                  >
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
                                disabled={
                                  submitting ||
                                  getHTMLCharacterLength(input.value) === 0 ||
                                  pristine
                                }
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
                </>
              )}
            </Field>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default EditCommentForm;
