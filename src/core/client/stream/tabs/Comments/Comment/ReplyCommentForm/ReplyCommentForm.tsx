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
} from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { useViewerEvent } from "coral-framework/lib/events";
import { OnSubmit } from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import { ReplyCommentFocusEvent } from "coral-stream/events";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  MatchMedia,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import {
  getCommentBodyValidators,
  getHTMLCharacterLength,
} from "../../helpers";
import RemainingCharactersContainer from "../../RemainingCharacters";
import RTEContainer from "../../RTE";
import ReplyTo from "./ReplyTo";

import styles from "./ReplyCommentForm.css";

interface FormProps {
  body: string;
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
  return (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, form, submitError }) => (
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
            <Field
              name="body"
              validate={getCommentBodyValidators(props.min, props.max)}
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
                          ref={props.rteRef}
                          disabled={submitting || props.disabled}
                          contentClassName={styles.rteContent}
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
                            disabled={
                              submitting ||
                              getHTMLCharacterLength(input.value) === 0 ||
                              props.disabled
                            }
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
                </>
              )}
            </Field>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default ReplyCommentForm;
