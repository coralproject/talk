import { RouterState, withRouter } from "found";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { SetRedirectPathMutation } from "coral-admin/mutations";
import {
  MutationProp,
  withFragmentContainer,
  withLocalStateContainer,
  withMutation,
} from "coral-framework/lib/relay";

import { AccountCompletionContainer_auth as AuthData } from "coral-admin/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_viewer as UserData } from "coral-admin/__generated__/AccountCompletionContainer_viewer.graphql";
import { AccountCompletionContainerLocal as Local } from "coral-admin/__generated__/AccountCompletionContainerLocal.graphql";

import CompleteAccountMutation from "./CompleteAccountMutation";
import SetAuthViewMutation from "./SetAuthViewMutation";

type Props = {
  completeAccount: MutationProp<typeof CompleteAccountMutation>;
  setAuthView: MutationProp<typeof SetAuthViewMutation>;
  local: Local;
  auth: AuthData;
  viewer: UserData | null;
  setRedirectPath: MutationProp<typeof SetRedirectPathMutation>;
} & RouterState;

function handleAccountCompletion(props: Props) {
  const {
    local: { authView, authDuplicateEmail },
    viewer,
    auth,
    setAuthView,
  } = props;
  if (viewer) {
    if (!viewer.email) {
      // email not set yet.
      if (
        // duplicate email detected during the `ADD_EMAIL_ADDRESS` process.
        authDuplicateEmail ||
        // detected duplicate email usually coming from a social login.
        viewer.duplicateEmail
      ) {
        // Duplicate email detected.
        if (authView !== "ADD_EMAIL_ADDRESS" && authView !== "LINK_ACCOUNT") {
          // `ADD_EMAIL_ADDRESS` view is allowed in case the viewer wants to change the email address.
          // otherwise direct to the link account view.
          setAuthView({ view: "LINK_ACCOUNT" });
        }
      } else if (authView !== "ADD_EMAIL_ADDRESS") {
        setAuthView({ view: "ADD_EMAIL_ADDRESS" });
      }
    } else if (!viewer.username) {
      // username not set yet.
      if (authView !== "CREATE_USERNAME") {
        // direct to create username view.
        setAuthView({ view: "CREATE_USERNAME" });
      }
    } else if (
      // password not set when local auth is enabled.
      !viewer.profiles.some((p) => p.__typename === "LocalProfile") &&
      auth.integrations.local.enabled &&
      (auth.integrations.local.targetFilter.admin ||
        auth.integrations.local.targetFilter.stream)
    ) {
      if (authView !== "CREATE_PASSWORD") {
        // direct to create password view.
        setAuthView({ view: "CREATE_PASSWORD" });
      }
    } else {
      // all set, complete account.
      props
        .completeAccount({ accessToken: props.local.accessToken! })
        .then(() => {
          props.router.replace(props.local.redirectPath || "/admin");
        });
      // account completed.
      return true;
    }
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
      const completed = handleAccountCompletion(this.props);
      if (completed) {
        this.setState({ completed });
      }
    }
  }

  public render() {
    const { children } = this.props;
    // We skip first frame to check for completion status.
    if (!this.state.checkedCompletionStatus || this.state.completed) {
      return null;
    }
    return <>{children}</>;
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment AccountCompletionContainerLocal on Local {
      accessToken
      authView
      authDuplicateEmail
      redirectPath
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
              admin
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
    withMutation(SetAuthViewMutation)(
      withMutation(SetRedirectPathMutation)(
        withMutation(CompleteAccountMutation)(
          withRouter(AccountCompletionContainer)
        )
      )
    )
  )
);

export default enhanced;
