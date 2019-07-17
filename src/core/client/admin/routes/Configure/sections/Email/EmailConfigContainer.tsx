import { FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import { RouteProps } from "found";
import React from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { EmailConfigContainer_email } from "coral-admin/__generated__/EmailConfigContainer_email.graphql";
import { DeepNullable, DeepPartial } from "coral-common/types";
import { pureMerge } from "coral-common/utils";
import { parseBool } from "coral-framework/lib/form";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLEmailConfiguration } from "coral-framework/schema";
import {
  CheckBox,
  Flex,
  FormField,
  HorizontalGutter,
} from "coral-ui/components";

import Header from "../../Header";
import FromContainer from "./FromContainer";
import SMTPContainer from "./SMTPContainer";

import styles from "./EmailConfigContainer.css";

interface Props {
  form: FormApi;
  submitting: boolean;
  email: EmailConfigContainer_email;
}

export type FormProps = DeepNullable<GQLEmailConfiguration>;
export type OnInitValuesFct = (values: DeepPartial<FormProps>) => void;

class EmailConfigContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues: DeepPartial<FormProps> = {};

  public componentDidMount() {
    this.props.form.initialize({ email: this.initialValues });
  }

  private handleOnInitValues: OnInitValuesFct = values => {
    if (values.smtp && values.smtp.authentication === null) {
      values = { ...values, smtp: { ...values.smtp, authentication: true } };
    }
    if (values.smtp && values.smtp.secure === null) {
      values = { ...values, smtp: { ...values.smtp, secure: true } };
    }

    this.initialValues = pureMerge<DeepPartial<FormProps>>(
      this.initialValues,
      values
    );
  };

  public render() {
    const { email, submitting } = this.props;

    return (
      <HorizontalGutter size="double">
        <Field name="email.enabled" type="checkbox" parse={parseBool}>
          {({ input }) => (
            <Header
              className={styles.title}
              container={<Flex justifyContent="space-between" />}
            >
              <div>
                <Localized id="configure-email">
                  <span>Email settings</span>
                </Localized>
              </div>
              <div>
                <FormField>
                  <Localized id="configure-email-configBoxEnabled">
                    <CheckBox
                      id={input.name}
                      name={input.name}
                      onChange={input.onChange}
                      checked={input.value}
                      disabled={submitting}
                    >
                      Enabled
                    </CheckBox>
                  </Localized>
                </FormField>
              </div>
            </Header>
          )}
        </Field>
        <Field name="email.enabled" subscription={{ value: true }}>
          {({ input: { value } }) => (
            <>
              <FromContainer
                email={email}
                disabled={submitting || !value}
                onInitValues={this.handleOnInitValues}
              />
              <SMTPContainer
                email={email}
                disabled={submitting || !value}
                onInitValues={this.handleOnInitValues}
              />
            </>
          )}
        </Field>
      </HorizontalGutter>
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
