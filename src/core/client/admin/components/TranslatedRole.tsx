import { Localized } from "@fluent/react/compat";
import React from "react";

import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";

interface Props {
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
  role: GQLUSER_ROLE_RL;
  scoped?: boolean;
  moderationScopesEnabled: boolean;
}

function createElement(
  Container: React.ReactElement<any> | React.ComponentType<any> | string,
  text: string
) {
  if (React.isValidElement<any>(Container)) {
    return React.cloneElement(Container, { children: text });
  } else {
    return <Container>{text}</Container>;
  }
}

const TranslatedRole: React.FunctionComponent<Props> = (props) => {
  switch (props.role) {
    case GQLUSER_ROLE.COMMENTER:
      return (
        <Localized id="role-commenter">
          {createElement(props.container!, "Commenter")}
        </Localized>
      );
    case GQLUSER_ROLE.MEMBER:
      return (
        <Localized id="role-member">
          {createElement(props.container!, "Member")}
        </Localized>
      );
    case GQLUSER_ROLE.ADMIN:
      return (
        <Localized id="role-admin">
          {createElement(props.container!, "Admin")}
        </Localized>
      );
    case GQLUSER_ROLE.MODERATOR:
      if (!props.moderationScopesEnabled) {
        return (
          <Localized id="role-moderator">
            {createElement(props.container!, "Moderator")}
          </Localized>
        );
      }

      if (props.scoped) {
        return (
          <Localized id="role-siteModerator">
            {createElement(props.container!, "Site Moderator")}
          </Localized>
        );
      }

      return (
        <Localized id="role-organizationModerator">
          {createElement(props.container!, "Organization Moderator")}
        </Localized>
      );
    case GQLUSER_ROLE.STAFF:
      return (
        <Localized id="role-staff">
          {createElement(props.container!, "Staff")}
        </Localized>
      );
    default:
      // Unknown role, just use untranslated string.
      return createElement(props.container!, props.role);
  }
};

TranslatedRole.defaultProps = {
  container: "span",
};

export default TranslatedRole;
