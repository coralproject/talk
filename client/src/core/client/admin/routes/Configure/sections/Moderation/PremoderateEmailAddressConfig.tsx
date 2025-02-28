import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  FieldSet,
  FormField,
  FormFieldHeader,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PremoderateEmailAddressConfig_formValues on Settings {
    premoderateEmailAddress {
      tooManyPeriods {
        enabled
      }
      emailAliases {
        enabled
      }
      domainAliases {
        enabled
      }
    }
  }
`;

interface Props {
  disabled: boolean;
}

const PremoderateEmailAddressConfig: FunctionComponent<Props> = ({
  disabled,
}) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-moderation-premoderateEmailAddress-title">
          <Header container={<legend />}>Email address</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <FormField container={<FieldSet />}>
        <FormFieldHeader>
          <Localized id="configure-moderation-premoderateEmailAddress-enabled">
            <Label component="legend">
              Pre-moderate emails with too many periods
            </Label>
          </Localized>
          <Localized id="configure-moderation-premoderateEmailAddress-enabled-description">
            <HelperText>
              If a user has three or more periods in the first part of their
              email address (before the @), set their status to pre-moderate
              comments. Emails with 3 or more periods can have a very high spam
              correlation. It can be useful to pro-actively pre-moderate them.
            </HelperText>
          </Localized>
        </FormFieldHeader>
        <OnOffField
          name="premoderateEmailAddress.tooManyPeriods.enabled"
          disabled={disabled}
        />
      </FormField>
      <FormField container={<FieldSet />}>
        <FormFieldHeader>
          <Localized id="configure-moderation-premoderateDomainAlias-enabled">
            <Label component="legend">Pre-moderate domain alias</Label>
          </Localized>
          <Localized id="configure-moderation-premoderateDomainAlias-enabled-description">
            <HelperText>
              If a user signs up for a new account with an email address that
              contains a subdomain (@subdomain.domain.com), set their status to
              pre-moderate comments. If the domain is already banned, ban the
              account. Domain aliases are commonly used by spammers to evade
              bans.
            </HelperText>
          </Localized>
        </FormFieldHeader>
        <OnOffField
          name="premoderateEmailAddress.domainAliases.enabled"
          disabled={disabled}
        />
      </FormField>
      <FormField container={<FieldSet />}>
        <FormFieldHeader>
          <Localized id="configure-moderation-premoderateEmailAliases-enabled">
            <Label component="legend">Pre-moderate email aliases</Label>
          </Localized>
          <Localized id="configure-moderation-premoderateEmailAliases-enabled-description">
            <HelperText>
              If a user signs up for a new account with an email address that is
              an alias (using a + sign) of an existing account, set their status
              to pre-moderate comments. Email aliases are commonly used by
              spammers and trolls to evade bans.
            </HelperText>
          </Localized>
        </FormFieldHeader>
        <OnOffField
          name="premoderateEmailAddress.emailAliases.enabled"
          disabled={disabled}
        />
      </FormField>
    </ConfigBox>
  );
};

export default PremoderateEmailAddressConfig;
