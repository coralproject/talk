import { CoralRTE } from "@coralproject/rte";
import { Localized } from "fluent-react/compat";
import React, {
  EventHandler,
  MouseEvent,
  Ref,
  StatelessComponent,
} from "react";
import { Field, Form } from "react-final-form";

import { OnSubmit } from "talk-framework/lib/form";
import Timestamp from "talk-stream/components/Timestamp";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  MatchMedia,
  Message,
  MessageIcon,
  RelativeTime,
  ValidationMessage,
} from "talk-ui/components";

import RemainingCharactersContainer from "../containers/RemainingCharactersContainer";
import { cleanupRTEEmptyHTML, getCommentBodyValidators } from "../helpers";
import { TopBarLeft, Username } from "./Comment";
import RTE from "./RTE";

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
  onSubmit: OnSubmit<FormProps>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onClose?: EventHandler<MouseEvent<any>>;
  initialValues?: FormProps;
  rteRef?: Ref<CoralRTE>;
  expired?: boolean;
  min: number | null;
  max: number | null;
}

const EditCommentForm: StatelessComponent<EditCommentFormProps> = props => {
  const inputID = `comments-editCommentForm-rte-${props.id}`;
  return (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, pristine, submitError }) => (
        <form
          className={props.className}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <HorizontalGutter>
            <div>
              <TopBarLeft>
                {props.author && props.author.username && (
                  <Username>{props.author.username}</Username>
                )}
                <Timestamp>{props.createdAt}</Timestamp>
              </TopBarLeft>
            </div>
            <Field
              name="body"
              validate={getCommentBodyValidators(props.min, props.max)}
            >
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
                      <RTE
                        inputId={inputID}
                        onChange={({ html }) =>
                          input.onChange(cleanupRTEEmptyHTML(html))
                        }
                        value={input.value}
                        placeholder="Edit comment"
                        forwardRef={props.rteRef}
                        disabled={submitting || props.expired}
                      />
                    </Localized>
                    {props.expired ? (
                      <Localized id="comments-editCommentForm-editTimeExpired">
                        <ValidationMessage fullWidth>
                          Edit time has expired. You can no longer edit this
                          comment. Why not post another one?
                        </ValidationMessage>
                      </Localized>
                    ) : (
                      <>
                        <Message fullWidth>
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
                            <ValidationMessage fullWidth>
                              {meta.error || meta.submitError}
                            </ValidationMessage>
                          )}
                        {submitError && (
                          <ValidationMessage fullWidth>
                            {submitError}
                          </ValidationMessage>
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
                          variant="outlined"
                          disabled={submitting}
                          onClick={props.onClose}
                        >
                          Close
                        </Button>
                      </Localized>
                    ) : (
                      <MatchMedia ltWidth="sm">
                        {matches => (
                          <>
                            <Localized id="comments-editCommentForm-cancel">
                              <Button
                                variant="outlined"
                                disabled={submitting}
                                onClick={props.onCancel}
                                fullWidth={matches}
                              >
                                Cancel
                              </Button>
                            </Localized>
                            <Localized id="comments-editCommentForm-saveChanges">
                              <Button
                                color="primary"
                                variant="filled"
                                disabled={
                                  submitting || !input.value || pristine
                                }
                                type="submit"
                                fullWidth={matches}
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
