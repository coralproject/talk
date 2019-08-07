import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import ConfirmEmailField from "coral-auth/components/ConfirmEmailField";
import EmailField from "coral-auth/components/EmailField";
import Main from "coral-auth/components/Main";
import { OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

import { SetEmailMutation, withSetEmailMutation } from "./SetEmailMutation";
import { ListItem, UnorderedList } from "./UnorderedList";

interface FormProps {
  email: string;
}

interface Props {
  setEmail: SetEmailMutation;
}

class AddEmailAddressContainer extends Component<Props> {
  private handleSubmit: OnSubmit<FormProps> = async (input, form) => {
    try {
      await this.props.setEmail({ email: input.email });
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    // tslint:disable-next-line:no-empty
    return (
      <div data-testid="addEmailAddress-container">
        <Bar>
          <Localized id="addEmailAddress-addEmailAddressHeader">
            <Title>Add Email Address</Title>
          </Localized>
        </Bar>
        <Main data-testid="addEmailAddress-main">
          <Form onSubmit={this.handleSubmit}>
            {({ handleSubmit, submitting, submitError }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <HorizontalGutter size="oneAndAHalf">
                  <Localized id="addEmailAddress-whatItIs">
                    <Typography variant="bodyCopy">
                      For your added security, we require users to add an email
                      address to their accounts. Your email address will be used
                      to:
                    </Typography>
                  </Localized>
                  <UnorderedList>
                    <ListItem icon={<Icon>done</Icon>}>
                      <Localized id="addEmailAddress-receiveUpdates">
                        <Typography container="div">
                          Receive updates regarding any changes to your account
                          (email address, username, password, etc.)
                        </Typography>
                      </Localized>
                    </ListItem>
                    <ListItem icon={<Icon>done</Icon>}>
                      <Localized id="addEmailAddress-allowDownload">
                        <Typography container="div">
                          Allow you to download your comments.
                        </Typography>
                      </Localized>
                    </ListItem>
                    <ListItem icon={<Icon>done</Icon>}>
                      <Localized id="addEmailAddress-sendNotifications">
                        <Typography container="div">
                          Send comment notifications that you have chosen to
                          receive.
                        </Typography>
                      </Localized>
                    </ListItem>
                  </UnorderedList>
                  {submitError && (
                    <CallOut color="error" fullWidth>
                      {submitError}
                    </CallOut>
                  )}
                  <EmailField disabled={submitting} />
                  <ConfirmEmailField disabled={submitting} />
                  <Localized id="addEmailAddress-addEmailAddressButton">
                    <Button
                      variant="filled"
                      color="primary"
                      size="large"
                      type="submit"
                      fullWidth
                      disabled={submitting}
                    >
                      Add Email Address
                    </Button>
                  </Localized>
                </HorizontalGutter>
              </form>
            )}
          </Form>
        </Main>
      </div>
    );
  }
}

const enhanced = withSetEmailMutation(AddEmailAddressContainer);
export default enhanced;
