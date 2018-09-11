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
import { required } from "talk-framework/lib/validation";
import {
  AriaInfo,
  Button,
  Flex,
  HorizontalGutter,
  RelativeTime,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import { Timestamp, TopBarLeft, Username } from "./Comment";
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
}

const EditCommentForm: StatelessComponent<EditCommentFormProps> = props => {
  const inputID = `comments-editCommentForm-rte-${props.id}`;
  return (
    <Form onSubmit={props.onSubmit} initialValues={props.initialValues}>
      {({ handleSubmit, submitting, hasValidationErrors, pristine }) => (
        <form
          className={props.className}
          autoComplete="off"
          onSubmit={handleSubmit}
          id={`comments-editCommentForm-form-${props.id}`}
        >
          <HorizontalGutter>
            <div>
              <TopBarLeft>
                {props.author &&
                  props.author.username && (
                    <Username>{props.author.username}</Username>
                  )}
                <Timestamp>{props.createdAt}</Timestamp>
              </TopBarLeft>
            </div>
            <Field name="body" validate={required}>
              {({ input, meta }) => (
                <div>
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
                      onChange={({ html }) => input.onChange(html)}
                      value={input.value}
                      placeholder="Edit comment"
                      forwardRef={props.rteRef}
                      disabled={submitting || props.expired}
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
            {props.expired ? (
              <Localized id="comments-editCommentForm-editTimeExpired">
                <ValidationMessage fullWidth>
                  Edit time has expired. You can no longer edit this comment.
                  Why not post another one?
                </ValidationMessage>
              </Localized>
            ) : (
              <ValidationMessage fullWidth>
                <Localized
                  id="comments-editCommentForm-editRemainingTime"
                  time={<RelativeTime date={props.editableUntil} live />}
                >
                  <span>{"Edit: <time></time> remaining"}</span>
                </Localized>
              </ValidationMessage>
            )}
            <Flex direction="row" justifyContent="flex-end" itemGutter="half">
              {props.expired ? (
                <Localized id="comments-editCommentForm-close">
                  <Button
                    id={`comments-editCommentForm-closeButton-${props.id}`}
                    variant="outlined"
                    disabled={submitting}
                    onClick={props.onClose}
                  >
                    Close
                  </Button>
                </Localized>
              ) : (
                <>
                  <Localized id="comments-editCommentForm-cancel">
                    <Button
                      id={`comments-editCommentForm-cancelButton-${props.id}`}
                      variant="outlined"
                      disabled={submitting}
                      onClick={props.onCancel}
                    >
                      Cancel
                    </Button>
                  </Localized>
                  <Localized id="comments-editCommentForm-saveChanges">
                    <Button
                      color="primary"
                      variant="filled"
                      disabled={submitting || hasValidationErrors || pristine}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </Localized>
                </>
              )}
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default EditCommentForm;
