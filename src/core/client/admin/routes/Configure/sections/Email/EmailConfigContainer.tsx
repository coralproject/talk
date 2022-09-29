import { Localized } from "@fluent/react/compat";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import { useNotification } from "coral-admin/App/GlobalNotification";
import { DeepNullable } from "coral-common/types";
import {
  purgeMetadata,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSettings } from "coral-framework/schema";
import { AppNotification, Button, CallOut, Flex } from "coral-ui/components/v2";

import { EmailConfigContainer_email } from "coral-admin/__generated__/EmailConfigContainer_email.graphql";
import { EmailConfigContainer_viewer } from "coral-admin/__generated__/EmailConfigContainer_viewer.graphql";

import Header from "../../Header";
import ConfigBoxWithToggleField from "../Auth/ConfigBoxWithToggleField";
import From from "./From";
import SMTP from "./SMTP";
import TestSMTPMutation from "./TestSMTPMutation";

interface Props {
  submitting: boolean;
  email: EmailConfigContainer_email;
  viewer: EmailConfigContainer_viewer | null;
}

export type FormProps = DeepNullable<Pick<GQLSettings, "email">>;

const EmailConfigContainer: React.FunctionComponent<Props> = ({
  email,
  submitting,
  viewer,
}) => {
  const form = useForm();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<null | string>(null);
  const { setMessage, clearMessage } = useNotification();
  const sendTest = useMutation(TestSMTPMutation);
  const sendTestEmail = useCallback(async () => {
    if (!viewer) {
      return;
    }
    setLoading(true);
    setSubmitError(null);
    try {
      await sendTest();
      setLoading(false);
      setMessage(
        <Localized
          id="configure-smtp-test-success"
          vars={{ email: viewer.email }}
        >
          <AppNotification icon="check_circle_outline" onClose={clearMessage}>
            Test email has been sent to {viewer.email}
          </AppNotification>
        </Localized>,
        3000
      );
    } catch (error) {
      if (error.code === "RATE_LIMIT_EXCEEDED") {
        setLoading(false);
      }

      setSubmitError(error.message);
    }
  }, []);
  useMemo(() => {
    let values: any = { email };
    if (email && email.smtp && email.smtp.authentication === null) {
      values = {
        email: {
          ...email,
          smtp: { ...email.smtp, authentication: true },
        },
      };
    }
    if (email && email.smtp && email.smtp.secure === null) {
      values = {
        email: {
          ...email,
          smtp: { ...email.smtp, secure: true },
        },
      };
    }
    form.initialize(purgeMetadata(values));
  }, []);
  return (
    <ConfigBoxWithToggleField
      disabled={submitting}
      title={
        <Localized id="configure-email">
          <Header container="h2">Email settings</Header>
        </Localized>
      }
      name="email.enabled"
    >
      {(disabledInside) => (
        <>
          <Flex justifyContent="flex-end">
            <Localized id="configure-email-send-test">
              <Button
                disabled={disabledInside || loading || !email.enabled}
                onClick={sendTestEmail}
              >
                Send test email
              </Button>
            </Localized>
          </Flex>
          {submitError && (
            <CallOut fullWidth color="error">
              {submitError}
            </CallOut>
          )}
          <From disabled={disabledInside} />
          <SMTP disabled={disabledInside} />
        </>
      )}
    </ConfigBoxWithToggleField>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment EmailConfigContainer_viewer on User {
      email
    }
  `,
  email: graphql`
    fragment EmailConfigContainer_email on EmailConfiguration {
      enabled
      ...From_formValues @relay(mask: false)
      ...SMTP_formValues @relay(mask: false)
    }
  `,
})(EmailConfigContainer);

export default enhanced;
