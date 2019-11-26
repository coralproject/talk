import { FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { DeepNullable, DeepPartial } from "coral-common/types";
import { pureMerge } from "coral-common/utils";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSettings } from "coral-framework/schema";

import { EmailConfigContainer_email } from "coral-admin/__generated__/EmailConfigContainer_email.graphql";

import Header from "../../Header";
import ConfigBoxWithToggleField from "../Auth/ConfigBoxWithToggleField";
import FromContainer from "./FromContainer";
import SMTPContainer from "./SMTPContainer";

interface Props {
  form: FormApi;
  submitting: boolean;
  email: EmailConfigContainer_email;
}

export type FormProps = DeepNullable<Pick<GQLSettings, "email">>;
export type OnInitValuesFct = (values: DeepPartial<FormProps>) => void;

class EmailConfigContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues: DeepPartial<FormProps> = {};

  public componentDidMount() {
    this.props.form.initialize(this.initialValues);
  }

  private handleOnInitValues: OnInitValuesFct = values => {
    if (
      values.email &&
      values.email.smtp &&
      values.email.smtp.authentication === null
    ) {
      values = {
        email: {
          ...values.email,
          smtp: { ...values.email.smtp, authentication: true },
        },
      };
    }
    if (
      values.email &&
      values.email.smtp &&
      values.email.smtp.secure === null
    ) {
      values = {
        email: {
          ...values.email,
          smtp: { ...values.email.smtp, secure: true },
        },
      };
    }

    this.initialValues = pureMerge<DeepPartial<FormProps>>(
      this.initialValues,
      values
    );
  };

  public render() {
    const { email, submitting } = this.props;

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
            <FromContainer
              email={email}
              disabled={disabledInside}
              onInitValues={this.handleOnInitValues}
            />
            <SMTPContainer
              email={email}
              disabled={disabledInside}
              onInitValues={this.handleOnInitValues}
            />
          </>
        )}
      </ConfigBoxWithToggleField>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  email: graphql`
    fragment EmailConfigContainer_email on EmailConfiguration {
      enabled
      ...FromContainer_email
      ...SMTPContainer_email
    }
  `,
})(EmailConfigContainer);

export default enhanced;
