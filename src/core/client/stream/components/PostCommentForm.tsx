import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import { required } from "talk-framework/lib/validation";
import { Button, Typography } from "talk-ui/components";
import * as styles from "./PostCommentForm.css";
import PoweredBy from "./PoweredBy";

interface FormProps {
  body: string;
}

export interface PostCommentFormProps {
  onSubmit: OnSubmit<FormProps>;
}

const PostCommentForm: StatelessComponent<PostCommentFormProps> = props => (
  <Form onSubmit={props.onSubmit}>
    {({ handleSubmit, submitting }) => (
      <form autoComplete="off" onSubmit={handleSubmit} className={styles.root}>
        <Field name="body" validate={required}>
          {({ input, meta }) => (
            <div>
              <textarea
                className={styles.textarea}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                placeholder="Post a comment"
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
          <PoweredBy />
          <Localized id="comments-postCommentForm-submit">
            <Button
              color="primary"
              variant="filled"
              disabled={submitting}
              type="submit"
            >
              Submit
            </Button>
          </Localized>
        </div>
      </form>
    )}
  </Form>
);

export default PostCommentForm;
