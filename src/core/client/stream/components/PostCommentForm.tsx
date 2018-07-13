import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

import { OnSubmit } from "talk-framework/lib/form";
import { required } from "talk-framework/lib/validation";
import { Button, Typography } from "talk-ui/components";

import * as styles from "./PostCommentForm.css";

interface FormProps {
  body: string;
}

export interface PostCommentFormProps {
  onSubmit: OnSubmit<FormProps>;
}

const PostCommentForm: StatelessComponent<PostCommentFormProps> = props => (
  <Form onSubmit={props.onSubmit}>
    {({ handleSubmit, submitting }) => (
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Field name="body" validate={required}>
          {({ input, meta }) => (
            <div>
              <textarea
                className={styles.textarea}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
              />
              {meta.touched &&
                (meta.error || meta.submitError) && (
                  <Typography align="right" color="error" gutterBottom>
                    {meta.error || meta.submitError}
                  </Typography>
                )}
            </div>
          )}
        </Field>
        <div className={styles.postButtonContainer}>
          <Localized id="comments-postCommentForm-post">
            <Button disabled={submitting} primary>
              Post
            </Button>
          </Localized>
        </div>
      </form>
    )}
  </Form>
);

export default PostCommentForm;
