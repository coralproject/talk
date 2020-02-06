import React, { Component } from "react";

import { SetViewMutation } from "coral-auth/mutations";
import {
  graphql,
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
    if (duplicateEmail) {
      setView({ view: "DUPLICATE_EMAIL" });
      return false;
    }
    if (!viewer.email) {
      if (view !== "ADD_EMAIL_ADDRESS") {
        setView({ view: "ADD_EMAIL_ADDRESS" });
      }
      return false;
    }
    if (!viewer.username) {
      if (view !== "CREATE_USERNAME") {
        setView({ view: "CREATE_USERNAME" });
      }
      return false;
    }
    if (
      !viewer.profiles.some(p => p.__typename === "LocalProfile") &&
      auth.integrations.local.enabled &&
      auth.integrations.local.targetFilter.stream
    ) {
      if (view !== "CREATE_PASSWORD") {
        setView({ view: "CREATE_PASSWORD" });
      }
      return false;
    }
    completeAccount({ accessToken: accessToken! });
    return true;
  }
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
