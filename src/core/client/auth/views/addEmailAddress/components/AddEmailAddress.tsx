import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "talk-auth/components//Header";
import ConfirmEmailField from "talk-auth/components/ConfirmEmailField";
import EmailField from "talk-auth/components/EmailField";
import Main from "talk-auth/components/Main";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { OnSubmit } from "talk-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Icon,
  Typography,
} from "talk-ui/components";

import { ListItem, UnorderedList } from "./UnorderedList";

interface FormProps {
  username: string;
}

export interface AddEmailAddressForm {
  onSubmit: OnSubmit<FormProps>;
}

const AddEmailAddress: StatelessComponent<AddEmailAddressForm> = props => {
  return (
    <div>
      <Bar>
        <Localized id="addEmailAddress-addEmailAddressHeader">
          <Title>Add Email Address</Title>
        </Localized>
      </Bar>
      <Main>
        <Form onSubmit={props.onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <AutoHeightContainer />
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
};

export default AddEmailAddress;
