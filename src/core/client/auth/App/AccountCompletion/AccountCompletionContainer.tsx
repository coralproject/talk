import React, { Component } from "react";
import { graphql } from "react-relay";

import { SetViewMutation } from "coral-auth/mutations";
import {
  MutationProp,
  withFragmentContainer,
  withLocalStateContainer,
  withMutation,
} from "coral-framework/lib/relay";

import { AccountCompletionContainer_auth as AuthData } from "coral-auth/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_viewer as UserData } from "coral-auth/__generated__/AccountCompletionContainer_viewer.graphql";
import { AccountCompletionContainerLocal as Local } from "coral-auth/__generated__/AccountCompletionContainerLocal.graphql";

import {
  CompleteAccountMutation,
  withCompleteAccountMutation,
} from "./CompleteAccountMutation";

interface Props {
  completeAccount: CompleteAccountMutation;
  setView: MutationProp<typeof SetViewMutation>;
  local: Local;
  auth: AuthData;
  viewer: UserData | null;
}

function handleAccountCompletion(props: Props) {
  const {
    local: { view, accessToken, duplicateEmail },
    viewer,
    auth,
    setView,
    completeAccount,
  } = props;
  if (viewer) {
    if (!viewer.email) {
      // email not set yet.
      if (
        // duplicate email detected during the `ADD_EMAIL_ADDRESS` process.
        duplicateEmail ||
        // detected duplicate email usually coming from a social login.
        viewer.duplicateEmail
      ) {
        // duplicateEmail detected.
        if (view !== "ADD_EMAIL_ADDRESS" && view !== "LINK_ACCOUNT") {
          // `ADD_EMAIL_ADDRESS` view is allowed in case the viewer wants to change the email address.
          // otherwise direct to the link account view.
          setView({ view: "LINK_ACCOUNT" });
        }
      } else if (view !== "ADD_EMAIL_ADDRESS") {
        setView({ view: "ADD_EMAIL_ADDRESS" });
      }
      return false;
    }
    if (!viewer.username) {
      // username not set yet.
      if (view !== "CREATE_USERNAME") {
        // direct to create username view.
        setView({ view: "CREATE_USERNAME" });
      }
      return false;
    }
    if (
      !viewer.profiles.some((p) => p.__typename === "LocalProfile") &&
      auth.integrations.local.enabled &&
      auth.integrations.local.targetFilter.stream
    ) {
      // password not set when local auth is enabled.
      if (view !== "CREATE_PASSWORD") {
        // direct to create password view.
        setView({ view: "CREATE_PASSWORD" });
      }
      return false;
    }
    // all set, complete account.
    completeAccount({ accessToken: accessToken! });

    // account completed.
    return true;
  }
  // account not completed yet.
  return false;
}

interface State {
  checkedCompletionStatus: boolean;
  completed: boolean;
}

class AccountCompletionContainer extends Component<Props, State> {
  public state = {
    checkedCompletionStatus: false,
    completed: false,
  };

  public componentDidMount() {
    const completed = handleAccountCompletion(this.props);
    this.setState({ checkedCompletionStatus: true, completed });
  }
  public componentDidUpdate() {
    if (!this.state.completed) {
      handleAccountCompletion(this.props);
    }
  }

  public render() {
    const { children } = this.props;
    // We skip first frame to check for completion status.
    if (!this.state.checkedCompletionStatus) {
      return null;
    }
    return <>{children}</>;
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment AccountCompletionContainerLocal on Local {
      accessToken
      view
      duplicateEmail
    }
  `
)(
  withFragmentContainer<Props>({
    auth: graphql`
      fragment AccountCompletionContainer_auth on Auth {
        integrations {
          local {
            enabled
            targetFilter {
              stream
            }
          }
        }
      }
    `,
    viewer: graphql`
      fragment AccountCompletionContainer_viewer on User {
        username
        email
        duplicateEmail
        profiles {
          __typename
        }
      }
    `,
  })(
    withMutation(SetViewMutation)(
      withCompleteAccountMutation(AccountCompletionContainer)
    )
  )
);

export default enhanced;
