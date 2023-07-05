import { Localized } from "@fluent/react/compat";
import React from "react";

import { GQLSTORY_STATUS, GQLSTORY_STATUS_RL } from "coral-framework/schema";

interface Props {
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
  children: GQLSTORY_STATUS_RL;
  isArchiving?: boolean;
  isArchived?: boolean;
  isUnarchiving?: boolean;
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
  if (props.children === GQLSTORY_STATUS.OPEN) {
    return (
      <Localized id="storyStatus-open">
        {createElement(props.container!, "Open")}
      </Localized>
    );
  }

  if (props.children === GQLSTORY_STATUS.CLOSED && props.isUnarchiving) {
    return (
      <Localized id="storyStatus-unarchiving">
        {createElement(props.container!, "Unarchiving")}
      </Localized>
    );
  }

  if (props.children === GQLSTORY_STATUS.CLOSED && props.isArchiving) {
    return (
      <Localized id="storyStatus-archiving">
        {createElement(props.container!, "Archiving")}
      </Localized>
    );
  }

  if (props.children === GQLSTORY_STATUS.CLOSED && props.isArchived) {
    return (
      <Localized id="storyStatus-archived">
        {createElement(props.container!, "Archived")}
      </Localized>
    );
  }

  if (props.children === GQLSTORY_STATUS.CLOSED) {
    return (
      <Localized id="storyStatus-closed">
        {createElement(props.container!, "Closed")}
      </Localized>
    );
  }

  // Unknown role, just use untranslated string.
  return createElement(props.container!, props.children);
};

TranslatedRole.defaultProps = {
  container: "span",
};

export default TranslatedRole;
