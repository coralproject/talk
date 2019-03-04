import { CoralRTE } from "@coralproject/rte";
import { FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, {
  EventHandler,
  MouseEvent,
  Ref,
  StatelessComponent,
} from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { OnSubmit } from "talk-framework/lib/form";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  MatchMedia,
  ValidationMessage,
} from "talk-ui/components";

import RemainingCharactersContainer from "../containers/RemainingCharactersContainer";
import { cleanupRTEEmptyHTML, getCommentBodyValidators } from "../helpers";
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
  onChange?: (state: FormState, form: FormApi) => void;
  initialValues?: FormProps;
  rteRef?: Ref<CoralRTE>;
  parentUsername: string | null;
  min: number | null;
  max: number | null;
}

const ReplyCommentForm: StatelessComponent<ReplyCommentFormProps> = props => {
  const inputID = `comments-replyCommentForm-rte-${props.id}`;
  return (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, form, submitError }) => (
        <form
          className={props.className}
          autoComplete="off"
          onSubmit={handleSubmit}
          id={`comments-replyCommentForm-form-${props.id}`}
        >
          <FormSpy
            onChange={state => props.onChange && props.onChange(state, form)}
          />
          <HorizontalGutter>
            <Field
              name="body"
              validate={getCommentBodyValidators(props.min, props.max)}
            >
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
                        <RTE
                          inputId={inputID}
                          onChange={({ html }) =>
                            input.onChange(cleanupRTEEmptyHTML(html))
                          }
                          value={input.value}
                          placeholder="Write a reply"
                          forwardRef={props.rteRef}
                          disabled={submitting}
                        />
                      </Localized>
                    </div>
                    {meta.touched &&
                      (meta.error ||
                        (meta.submitError && !meta.dirtySinceLastSubmit)) && (
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
                  </HorizontalGutter>

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
                            disabled={submitting || !input.value}
                            type="submit"
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
