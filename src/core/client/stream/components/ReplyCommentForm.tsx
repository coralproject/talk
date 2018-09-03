import { FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { EventHandler, MouseEvent, StatelessComponent } from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { OnSubmit } from "talk-framework/lib/form";
import { required } from "talk-framework/lib/validation";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  Typography,
} from "talk-ui/components";

import RTE from "./RTE";

interface FormProps {
  body: string;
}

export interface ReplyCommentFormProps {
  className?: string;
  onSubmit: OnSubmit<FormProps>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onChange?: (state: FormState) => void;
  initialValues?: FormProps;
}

const ReplyCommentForm: StatelessComponent<ReplyCommentFormProps> = props => (
  <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
    {({ handleSubmit, submitting }) => (
      <form
        className={props.className}
        autoComplete="off"
        onSubmit={handleSubmit}
        id="comments-replyCommentForm-form"
      >
        <FormSpy onChange={props.onChange} />
        <HorizontalGutter>
          <Field name="body" validate={required}>
            {({ input, meta }) => (
              <div>
                <Localized id="comments-replyCommentForm-rteLabel">
                  <AriaInfo
                    component="label"
                    htmlFor="comments-replyCommentForm-field"
                  >
                    Write a reply
                  </AriaInfo>
                </Localized>
                <Localized
                  id="comments-replyCommentForm-rte"
                  attrs={{ placeholder: true }}
                >
                  <RTE
                    inputId="comments-replyCommentForm-field"
                    onChange={({ html }) => input.onChange(html)}
                    value={input.value}
                    placeholder="Write a reply"
                  />
                </Localized>
                {meta.touched &&
                  (meta.error || meta.submitError) && (
                    <Typography align="right" color="error" gutterBottom>
                      {meta.error || meta.submitError}
                    </Typography>
                  )}
              </div>
            )}
          </Field>
          <Flex direction="row" justifyContent="flex-end" itemGutter="half">
            <Localized id="comments-replyCommentForm-cancel">
              <Button
                variant="outlined"
                disabled={submitting}
                onClick={props.onCancel}
              >
                Cancel
              </Button>
            </Localized>
            <Localized id="comments-replyCommentForm-submit">
              <Button
                color="primary"
                variant="filled"
                disabled={submitting}
                type="submit"
              >
                Submit
              </Button>
            </Localized>
          </Flex>
        </HorizontalGutter>
      </form>
    )}
  </Form>
);

export default ReplyCommentForm;
