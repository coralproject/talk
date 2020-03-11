import { Localized } from "@fluent/react/compat";
import React, { useMemo, useCallback, useState } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import { useNotification } from "coral-admin/App/GlobalNotification";
import { DeepNullable } from "coral-common/types";
import { AppNotification, Button, Flex } from "coral-ui/components/v2";
import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSettings } from "coral-framework/schema";
import { useMutation } from "coral-framework/lib/relay";

import { EmailConfigContainer_email } from "coral-admin/__generated__/EmailConfigContainer_email.graphql";
import TestSMTPMutation from "./TestSMTPMutation";
import Header from "../../Header";
import ConfigBoxWithToggleField from "../Auth/ConfigBoxWithToggleField";
import From from "./From";
import SMTP from "./SMTP";

interface Props {
  submitting: boolean;
  email: EmailConfigContainer_email;
}

export type FormProps = DeepNullable<Pick<GQLSettings, "email">>;

const EmailConfigContainer: React.FunctionComponent<Props> = ({
  email,
  submitting,
}) => {
  const form = useForm();
  const [loading, setLoading] = useState(false);
  const { setMessage, clearMessage } = useNotification();
  const sendTest = useMutation(TestSMTPMutation);
  const sendTestEmail = useCallback(async () => {
    setLoading(true);
    await sendTest();
    setLoading(false);
    setMessage(
      <Localized id="configure-smtp-test-success" $email="test.com">
        <AppNotification icon="check_circle_outline" onClose={clearMessage}>
          Test email has been sent to test.com
        </AppNotification>
      </Localized>,
      3000
    );
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
      {disabledInside => (
        <>
          <Flex justifyContent="flex-end">
            <Button
              disabled={disabledInside || loading || !email.enabled}
              onClick={sendTestEmail}
            >
              Send test email
            </Button>
          </Flex>
          <From disabled={disabledInside} />
          <SMTP disabled={disabledInside} />
        </>
      )}
    </ConfigBoxWithToggleField>
  );
};

const enhanced = withFragmentContainer<Props>({
  email: graphql`
    fragment EmailConfigContainer_email on EmailConfiguration {
      enabled
      ...From_formValues @relay(mask: false)
      ...SMTP_formValues @relay(mask: false)
    }
  `,
})(EmailConfigContainer);

export default enhanced;
