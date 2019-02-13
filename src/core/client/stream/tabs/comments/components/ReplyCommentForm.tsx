import { CoralRTE } from "@coralproject/rte";
import { FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, {
  EventHandler,
  MouseEvent,
  Ref,
  StatelessComponent,
} from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { OnSubmit } from "talk-framework/lib/form";
import { required } from "talk-framework/lib/validation";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  MatchMedia,
  ValidationMessage,
} from "talk-ui/components";

import ReplyTo from "./ReplyTo";
import RTE from "./RTE";

interface FormProps {
  body: string;
}

export interface ReplyCommentFormProps {
  id: string;
  className?: string;
  onSubmit: OnSubmit<FormProps>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onChange?: (state: FormState) => void;
  initialValues?: FormProps;
  rteRef?: Ref<CoralRTE>;
  parentUsername: string | null;
}

const ReplyCommentForm: StatelessComponent<ReplyCommentFormProps> = props => {
  const inputID = `comments-replyCommentForm-rte-${props.id}`;
  return (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, hasValidationErrors, submitError }) => (
        <form
          className={props.className}
          autoComplete="off"
          onSubmit={handleSubmit}
          id={`comments-replyCommentForm-form-${props.id}`}
        >
          <FormSpy onChange={props.onChange} />
          <HorizontalGutter>
            <Field name="body" validate={required}>
              {({ input, meta }) => (
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
                      <RTE
                        inputId={inputID}
                        onChange={({ html }) => input.onChange(html)}
                        value={input.value}
                        placeholder="Write a reply"
                        forwardRef={props.rteRef}
                        disabled={submitting}
                      />
                    </Localized>
                  </div>
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                  {submitError && (
                    <ValidationMessage fullWidth>
                      {submitError}
                    </ValidationMessage>
                  )}
                </HorizontalGutter>
              )}
            </Field>
            <MatchMedia ltWidth="sm">
              {matches => (
                <Flex
                  direction="row"
                  justifyContent="flex-end"
                  itemGutter="half"
                >
                  <Localized id="comments-replyCommentForm-cancel">
                    <Button
                      variant="outlined"
                      disabled={submitting}
                      onClick={props.onCancel}
                      fullWidth={matches}
                    >
                      Cancel
                    </Button>
                  </Localized>
                  <Localized id="comments-replyCommentForm-submit">
                    <Button
                      color="primary"
                      variant="filled"
                      disabled={submitting || hasValidationErrors}
                      type="submit"
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
