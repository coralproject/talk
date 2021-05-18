import { Localized } from "@fluent/react/compat";
import React from "react";

import { GQLSTORY_STATUS } from "coral-admin/schema";

interface Props {
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
  children: GQLSTORY_STATUS;
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
    case GQLSTORY_STATUS.OPEN:
      return (
        <Localized id="storyStatus-open">
          {createElement(props.container!, "Open")}
        </Localized>
      );
    case GQLSTORY_STATUS.CLOSED:
      return (
        <Localized id="storyStatus-closed">
          {createElement(props.container!, "Closed")}
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
