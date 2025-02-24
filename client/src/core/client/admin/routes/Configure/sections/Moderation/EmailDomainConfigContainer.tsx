import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field } from "react-final-form";
import { graphql } from "relay-runtime";

import { formatStringList, parseStringList } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { validateEmailDomainList } from "coral-framework/lib/validation";
import { AddIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  CallOut,
  FieldSet,
  Flex,
  FormField,
  FormFieldDescription,
  FormFieldHeader,
  HelperText,
  Label,
  Textarea,
  TextLink,
} from "coral-ui/components/v2";

import { EmailDomainConfigContainer_settings } from "coral-admin/__generated__/EmailDomainConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import ValidationMessage from "../../ValidationMessage";
import EmailDomainTableContainer from "./EmailDomainTableContainer";
import RefreshDisposableEmailDomainsMutation from "./RefreshDisposableEmailDomainsMutation";

import styles from "./EmailDomainConfigContainer.css";

interface Props {
  settings: EmailDomainConfigContainer_settings;
  disabled: boolean;
}

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment EmailDomainConfigContainer_formValues on Settings {
    protectedEmailDomains
    disposableEmailDomains {
      enabled
    }
  }
`;

const EmailDomainConfigContainer: FunctionComponent<Props> = ({
  settings,
  disabled,
}) => {
  const { protectedEmailDomains } = settings;
  const [showDomainList, setShowDomainList] = useState(false);
  const [
    refreshDisposableEmailDomainsError,
    setRefreshDisposableEmailDomainsError,
  ] = useState<string | null>(null);
  const [
    refreshingDisposableEmailDomains,
    setRefreshingDisposableEmailDomains,
  ] = useState(false);

  const refreshEmailDomains = useMutation(
    RefreshDisposableEmailDomainsMutation
  );

  const refreshDisposableEmailDomains = useCallback(async () => {
    try {
      setRefreshingDisposableEmailDomains(true);
      await refreshEmailDomains();
      setTimeout(() => {
        setRefreshingDisposableEmailDomains(false);
      }, 1500);
    } catch (e) {
      setRefreshDisposableEmailDomainsError(
        `Error refreshing disposable domains: ${e}`
      );
      setRefreshingDisposableEmailDomains(false);
    }
  }, [refreshEmailDomains]);

  const EmailDomainsListLink = () => {
    return (
      <Localized id="configure-moderation-emailDomains-disposableEmailDomains-list-linkText">
        <TextLink
          target="_blank"
          href="https://disposable.github.io/disposable-email-domains/domains_mx.json"
        >
          {"disposable-email-domains"}
        </TextLink>
      </Localized>
    );
  };

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
      <Localized id="configure-moderation-emailDomains-protectedEmailDomains">
        <Label component="legend">Protected email domains</Label>
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
        <Localized id="configure-moderation-emailDomains-exceptions-ban-premod-helperText">
          <HelperText>
            These domains cannot be banned or pre-moderated. Domains should be
            written without www, for example "gmail.com". Separate domains with
            a comma and a space.
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
      <FormField container={<FieldSet />}>
        <FormFieldHeader>
          <Localized id="configure-moderation-emailDomains-disposableEmailDomains-enabled">
            <Label component="legend">Disposable email domains</Label>
          </Localized>
          <Localized id="configure-moderation-emailDomains-disposableEmailDomains-helper-text">
            <HelperText>
              If a new user registers using a disposable email address, set
              their status to 'always pre-moderate comments.' Accounts with
              disposable email addresses can have a high spam / troll
              correlation.
            </HelperText>
          </Localized>
        </FormFieldHeader>
        <OnOffField name="disposableEmailDomains.enabled" disabled={disabled} />
        <Localized
          id="configure-moderation-emailDomains-disposableEmailDomains-update-button-helper-text"
          elems={{
            link: <EmailDomainsListLink />,
          }}
        >
          <HelperText>
            The email domains come from the <EmailDomainsListLink /> list, which
            is regularly updated. Use the button below to import their latest
            list.
          </HelperText>
        </Localized>
        <Localized
          id={`${
            refreshingDisposableEmailDomains
              ? "configure-moderation-emailDomains-disposableEmailDomains-updating"
              : "configure-moderation-emailDomains-disposableEmailDomains-update-button"
          }`}
        >
          <Button
            onClick={refreshDisposableEmailDomains}
            disabled={
              !settings.disposableEmailDomains?.enabled ||
              refreshingDisposableEmailDomains
            }
          >
            {refreshingDisposableEmailDomains
              ? "Updating"
              : "Update disposable domains"}
          </Button>
        </Localized>
        {refreshDisposableEmailDomainsError && (
          <CallOut fullWidth color="error">
            {refreshDisposableEmailDomainsError}
          </CallOut>
        )}
      </FormField>
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EmailDomainConfigContainer_settings on Settings {
      protectedEmailDomains
      disposableEmailDomains {
        enabled
      }
      ...EmailDomainTableContainer_settings
    }
  `,
})(EmailDomainConfigContainer);

export default enhanced;
