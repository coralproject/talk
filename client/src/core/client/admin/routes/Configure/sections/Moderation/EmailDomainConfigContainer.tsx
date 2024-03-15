import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useState } from "react";
import { Field } from "react-final-form";
import { graphql } from "relay-runtime";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { validateEmailDomainList } from "coral-framework/lib/validation";
import { AddIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  Flex,
  FormField,
  FormFieldDescription,
  FormFieldHeader,
  HelperText,
  Label,
  Textarea,
} from "coral-ui/components/v2";

import { EmailDomainConfigContainer_settings } from "coral-admin/__generated__/EmailDomainConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";
import EmailDomainTableContainer from "./EmailDomainTableContainer";

import styles from "./EmailDomainConfigContainer.css";

interface Props {
  settings: EmailDomainConfigContainer_settings;
  disabled: boolean;
}

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment EmailDomainConfigContainer_formValues on Settings {
    protectedEmailDomains
  }
`;

const EmailDomainConfigContainer: FunctionComponent<Props> = ({
  settings,
  disabled,
}) => {
  const { protectedEmailDomains } = settings;
  const [showDomainList, setShowDomainList] = useState(false);

  return (
    <ConfigBox
      id="emailDomain"
      data-testid="emailDomain-container"
      title={
        <Localized id="configure-moderation-emailDomains-header">
          <Header container="legend">Email domain</Header>
        </Localized>
      }
    >
      <Localized id="configure-moderation-emailDomains-description">
        <FormFieldDescription>
          Create rules to take action on accounts or comments based on the
          account holder's email address domain.
        </FormFieldDescription>
      </Localized>
      <Localized
        id="configure-moderation-emailDomains-addDomain"
        elems={{ icon: <ButtonSvgIcon size="xs" Icon={AddIcon} /> }}
      >
        <Button to="/admin/configure/moderation/domains/add" iconLeft>
          Add domain
        </Button>
      </Localized>
      <Flex>
        {!showDomainList ? (
          <Localized id="configure-moderation-emailDomains-showCurrent">
            <Button variant="text" onClick={() => setShowDomainList(true)}>
              Show current domain list
            </Button>
          </Localized>
        ) : (
          <Localized id="configure-moderation-emailDomains-hideCurrent">
            <Button variant="text" onClick={() => setShowDomainList(false)}>
              Hide current domain list
            </Button>
          </Localized>
        )}
      </Flex>
      {showDomainList && <EmailDomainTableContainer settings={settings} />}
      <FormField>
        <FormFieldHeader>
          <Localized id="configure-moderation-emailDomains-exceptions-header">
            <Label component="legend">Exceptions</Label>
          </Localized>
        </FormFieldHeader>
        <Localized id="configure-moderation-emailDomains-exceptions-helperText">
          <HelperText>
            These domains cannot be banned. Domains should be written without
            www, for example `gmail.com`. Separate domains with a comma.
          </HelperText>
        </Localized>
        <Field
          name="protectedEmailDomains"
          parse={parseStringList}
          format={formatStringList}
          validate={validateEmailDomainList}
          defaultValue={protectedEmailDomains}
        >
          {({ input, meta }) => (
            <>
              <Textarea
                {...input}
                className={styles.textArea}
                id={`configure-advanced-${input.name}`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                fullwidth
                disabled={disabled}
              />
              <ValidationMessage meta={meta} />
            </>
          )}
        </Field>
      </FormField>
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EmailDomainConfigContainer_settings on Settings {
      protectedEmailDomains
      ...EmailDomainTableContainer_settings
    }
  `,
})(EmailDomainConfigContainer);

export default enhanced;
