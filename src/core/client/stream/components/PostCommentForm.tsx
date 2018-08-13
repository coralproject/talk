import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import PoweredBy from "./PoweredBy";
import { OnSubmit } from "talk-framework/lib/form";
import { required } from "talk-framework/lib/validation";
import PoweredBy from "talk-stream/components/PoweredBy";
import { Button, Typography } from "talk-ui/components";
import * as styles from "./PostCommentForm.css";

interface FormProps {
  body: string;
}

export interface PostCommentFormProps {
  onSubmit: OnSubmit<FormProps>;
  signedIn: boolean;
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
        {props.signedIn ? (
          <div className={styles.postButtonContainer}>
            <PoweredBy />
            <Localized id="comments-postCommentForm-submit">
              <Button color="primary" variant="filled" disabled={submitting}>
                Submit
              </Button>
            </Localized>
          </div>
        ) : (
          <Button
            color="primary"
            variant="filled"
            disabled
            fullWidth
            size="large"
          >
            Sign In and join the conversation
          </Button>
        )}
      </form>
    )}
  </Form>
);

export default PostCommentForm;
