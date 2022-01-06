import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { withRouteConfig } from "coral-framework/lib/router";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { HorizontalGutter } from "coral-ui/components/v2";

import EmailDomainForm from "./EmailDomainForm";

const AddEmailDomainRoute: FunctionComponent = () => {
  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-moderation-emailDomains-add">
            <Header>Add email domain</Header>
          </Localized>
        }
      >
        <EmailDomainForm />
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withRouteConfig({
  cacheConfig: { force: true },
})(AddEmailDomainRoute);

export default enhanced;
