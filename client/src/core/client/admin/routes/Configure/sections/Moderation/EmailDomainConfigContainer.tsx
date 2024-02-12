import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useState } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { AddIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import { Button, Flex, FormFieldDescription } from "coral-ui/components/v2";

import { EmailDomainConfigContainer_settings } from "coral-admin/__generated__/EmailDomainConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";

import EmailDomainTableContainer from "./EmailDomainTableContainer";

interface Props {
  settings: EmailDomainConfigContainer_settings;
}

const EmailDomainConfigContainer: FunctionComponent<Props> = ({ settings }) => {
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
          account holder's email address domain. Action only applies to newly
          created accounts.
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
          <Localized id="">
            <Button variant="text" onClick={() => setShowDomainList(true)}>
              Show current domain list
            </Button>
          </Localized>
        ) : (
          <Localized id="">
            <Button variant="text" onClick={() => setShowDomainList(false)}>
              Hide current domain list
            </Button>
          </Localized>
        )}
      </Flex>
      {showDomainList && <EmailDomainTableContainer settings={settings} />}
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EmailDomainConfigContainer_settings on Settings {
      ...EmailDomainTableContainer_settings
    }
  `,
})(EmailDomainConfigContainer);

export default enhanced;
