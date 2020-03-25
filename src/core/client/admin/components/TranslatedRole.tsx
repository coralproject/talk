import { Localized } from "@fluent/react/compat";
import React from "react";

import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";

interface Props {
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
  children: GQLUSER_ROLE_RL;
}

function createElement(
  Container: React.ReactElement<any> | React.ComponentType<any> | string,
  children: React.ReactNode
) {
  if (React.isValidElement<any>(Container)) {
    return React.cloneElement(Container, { children });
  } else {
    return <Container>{children}</Container>;
  }
}

const TranslatedRole: React.FunctionComponent<Props> = (props) => {
  switch (props.children) {
    case GQLUSER_ROLE.COMMENTER:
      return (
        <Localized id="role-commenter">
          {createElement(props.container!, "Commenter")}
        </Localized>
      );
    case GQLUSER_ROLE.ADMIN:
      return (
        <Localized id="role-admin">
          {createElement(props.container!, "Admin")}
        </Localized>
      );
    case GQLUSER_ROLE.MODERATOR:
      return (
        <Localized id="role-moderator">
          {createElement(props.container!, "Moderator")}
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
      return createElement(props.container!, props.children);
  }
};

TranslatedRole.defaultProps = {
  container: "span",
};

export default TranslatedRole;
