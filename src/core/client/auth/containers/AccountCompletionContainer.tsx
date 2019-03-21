import * as React from "react";
import { Component } from "react";

import { AccountCompletionContainer_auth as AuthData } from "talk-auth/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_viewer as UserData } from "talk-auth/__generated__/AccountCompletionContainer_viewer.graphql";
import { AccountCompletionContainerLocal as Local } from "talk-auth/__generated__/AccountCompletionContainerLocal.graphql";
import {
  CompleteAccountMutation,
  SetViewMutation,
  withCompleteAccountMutation,
  withSetViewMutation,
} from "talk-auth/mutations";
import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

interface Props {
  completeAccount: CompleteAccountMutation;
  setView: SetViewMutation;
  local: Local;
  auth: AuthData;
  viewer: UserData | null;
}

function handleAccountCompletion(props: Props) {
  const {
    local: { view, accessToken },
    viewer,
    auth,
    setView,
    completeAccount,
  } = props;
  if (viewer) {
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
}

class AccountCompletionContainer extends Component<Props, State> {
  public state = {
    checkedCompletionStatus: false,
  };

  public componentDidMount() {
    handleAccountCompletion(this.props);
    this.setState({ checkedCompletionStatus: true });
  }
  public componentDidUpdate() {
    handleAccountCompletion(this.props);
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
    withSetViewMutation(withCompleteAccountMutation(AccountCompletionContainer))
  )
);

export default enhanced;
