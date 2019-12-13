import { Localized } from "fluent-react/compat";
import React, { useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql } from "react-relay";

import { DeepNullable } from "coral-common/types";
import {
  purgeMetadata,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSettings } from "coral-framework/schema";

import { EmailConfigContainer_email } from "coral-admin/__generated__/EmailConfigContainer_email.graphql";

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
