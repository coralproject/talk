import { Localized } from "fluent-react/compat";
import React from "react";

interface Props {
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
  children:
    | "COMMENTER"
    | "ADMIN"
    | "MODERATOR"
    | "STAFF"
    | "%future added value";
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

const TranslatedRole: React.StatelessComponent<Props> = props => {
  switch (props.children) {
    case "COMMENTER":
      return (
        <Localized id="role-comment">
          {createElement(props.container!, "Commenter")}
        </Localized>
      );
    case "ADMIN":
      return (
        <Localized id="role-admin">
          {createElement(props.container!, "Admin")}
        </Localized>
      );
    case "MODERATOR":
      return (
        <Localized id="role-moderator">
          {createElement(props.container!, "Moderator")}
        </Localized>
      );
    case "STAFF":
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
