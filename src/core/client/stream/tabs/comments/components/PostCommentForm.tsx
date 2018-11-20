import { FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
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

import styles from "./PostCommentForm.css";
import PoweredBy from "./PoweredBy";
import RTE from "./RTE";

interface FormProps {
  body: string;
}

export interface PostCommentFormProps {
  onSubmit: OnSubmit<FormProps>;
  onChange?: (state: FormState) => void;
  initialValues?: FormProps;
}

const PostCommentForm: StatelessComponent<PostCommentFormProps> = props => (
  <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
    {({ handleSubmit, submitting, hasValidationErrors }) => (
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className={styles.root}
        id="comments-postCommentForm-form"
      >
        <FormSpy onChange={props.onChange} />
        <HorizontalGutter>
          <Field name="body" validate={required}>
            {({ input, meta }) => (
              <div>
                <Localized id="comments-postCommentForm-rteLabel">
                  <AriaInfo
                    component="label"
                    htmlFor="comments-postCommentForm-field"
                  >
                    Post a comment
                  </AriaInfo>
                </Localized>
                <Localized
                  id="comments-postCommentForm-rte"
                  attrs={{ placeholder: true }}
                >
                  <RTE
                    inputId="comments-postCommentForm-field"
                    onChange={({ html }) => input.onChange(html)}
                    value={input.value}
                    placeholder="Post a comment"
                    disabled={submitting}
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
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <PoweredBy className={styles.poweredBy} />
            <Localized id="comments-postCommentForm-submit">
              <Button
                color="primary"
                variant="filled"
                disabled={submitting || hasValidationErrors}
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

export default PostCommentForm;
