import { withRouter, WithRouter } from "found";
import * as React from "react";
import { Component } from "react";

import { AccountCompletionContainer_auth as AuthData } from "talk-admin/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_me as UserData } from "talk-admin/__generated__/AccountCompletionContainer_me.graphql";
import { AccountCompletionContainerLocal as Local } from "talk-admin/__generated__/AccountCompletionContainerLocal.graphql";
import {
  CompleteAccountMutation,
  SetAuthViewMutation,
  SetRedirectPathMutation,
  withCompleteAccountMutation,
  withSetAuthViewMutation,
  withSetRedirectPathMutation,
} from "talk-admin/mutations";
import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

type Props = {
  completeAccount: CompleteAccountMutation;
  setAuthView: SetAuthViewMutation;
  local: Local;
  auth: AuthData;
  me: UserData | null;
  setRedirectPath: SetRedirectPathMutation;
} & WithRouter;

function handleAccountCompletion(props: Props) {
  const {
    local: { authView },
    me,
    auth,
    setAuthView,
  } = props;
  if (me) {
    if (!me.email) {
      if (authView !== "ADD_EMAIL_ADDRESS") {
        setAuthView({ view: "ADD_EMAIL_ADDRESS" });
      }
    } else if (!me.username) {
      if (authView !== "CREATE_USERNAME") {
        setAuthView({ view: "CREATE_USERNAME" });
      }
    } else if (
      !me.profiles.some(p => p.__typename === "LocalProfile") &&
      auth.integrations.local.enabled &&
      (auth.integrations.local.targetFilter.admin ||
        auth.integrations.local.targetFilter.stream)
    ) {
      if (authView !== "CREATE_PASSWORD") {
        setAuthView({ view: "CREATE_PASSWORD" });
      }
    } else {
      props.completeAccount({ authToken: props.local.authToken! }).then(() => {
        props.router.replace(props.local.redirectPath || "/admin");
      });
      return true;
    }
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
      authToken
      authView
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
    me: graphql`
      fragment AccountCompletionContainer_me on User {
        username
        email
        profiles {
          __typename
        }
      }
    `,
  })(
    withSetAuthViewMutation(
      withSetRedirectPathMutation(
        withCompleteAccountMutation(withRouter(AccountCompletionContainer))
      )
    )
  )
);

export default enhanced;
