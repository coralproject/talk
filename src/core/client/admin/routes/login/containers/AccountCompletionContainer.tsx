import { withRouter, WithRouter } from "found";
import * as React from "react";
import { Component } from "react";

import { AccountCompletionContainer_auth as AuthData } from "talk-admin/__generated__/AccountCompletionContainer_auth.graphql";
import { AccountCompletionContainer_viewer as UserData } from "talk-admin/__generated__/AccountCompletionContainer_viewer.graphql";
import { AccountCompletionContainerLocal as Local } from "talk-admin/__generated__/AccountCompletionContainerLocal.graphql";
import {
  CompleteAccountMutation,
  SetAuthViewMutation,
  SetRedirectPathMutation,
} from "talk-admin/mutations";
import {
  graphql,
  MutationProp,
  withFragmentContainer,
  withLocalStateContainer,
  withMutation,
} from "talk-framework/lib/relay";

type Props = {
  completeAccount: MutationProp<typeof CompleteAccountMutation>;
  setAuthView: MutationProp<typeof SetAuthViewMutation>;
  local: Local;
  auth: AuthData;
  viewer: UserData | null;
  setRedirectPath: MutationProp<typeof SetRedirectPathMutation>;
} & WithRouter;

function handleAccountCompletion(props: Props) {
  const {
    local: { authView },
    viewer,
    auth,
    setAuthView,
  } = props;
  if (viewer) {
    if (!viewer.email) {
      if (authView !== "ADD_EMAIL_ADDRESS") {
        setAuthView({ view: "ADD_EMAIL_ADDRESS" });
      }
    } else if (!viewer.username) {
      if (authView !== "CREATE_USERNAME") {
        setAuthView({ view: "CREATE_USERNAME" });
      }
    } else if (
      !viewer.profiles.some(p => p.__typename === "LocalProfile") &&
      auth.integrations.local.enabled &&
      (auth.integrations.local.targetFilter.admin ||
        auth.integrations.local.targetFilter.stream)
    ) {
      if (authView !== "CREATE_PASSWORD") {
        setAuthView({ view: "CREATE_PASSWORD" });
      }
    } else {
      props
        .completeAccount({ accessToken: props.local.accessToken! })
        .then(() => {
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
      accessToken
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
