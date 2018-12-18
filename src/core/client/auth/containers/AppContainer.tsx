import * as React from "react";
import { Component } from "react";

import { AppContainer_auth as AuthData } from "talk-auth/__generated__/AppContainer_auth.graphql";
import { AppContainer_me as UserData } from "talk-auth/__generated__/AppContainer_me.graphql";
import { AppContainerLocal as Local } from "talk-auth/__generated__/AppContainerLocal.graphql";
import {
  CompleteSignInMutation,
  SetViewMutation,
  withCompleteSignInMutation,
  withSetViewMutation,
} from "talk-auth/mutations";
import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

import App from "../components/App";

interface Props {
  completeSignIn: CompleteSignInMutation;
  setView: SetViewMutation;
  local: Local;
  auth: AuthData;
  me: UserData | null;
}

function handleSignInCompletion(props: Props) {
  const {
    local: { view, authToken },
    me,
    auth,
    setView,
    completeSignIn,
  } = props;
  if (me) {
    if (!me.email) {
      if (view !== "ADD_EMAIL_ADDRESS") {
        setView({ view: "ADD_EMAIL_ADDRESS" });
      }
    } else if (!me.username) {
      if (view !== "CREATE_USERNAME") {
        setView({ view: "CREATE_USERNAME" });
      }
    } else if (
      !me.profiles.some(p => p.__typename === "LocalProfile") &&
      auth.integrations.local.enabled &&
      auth.integrations.local.targetFilter.stream
    ) {
      if (view !== "CREATE_PASSWORD") {
        setView({ view: "CREATE_PASSWORD" });
      }
    } else {
      completeSignIn({ authToken: authToken! });
      return true;
    }
  }
  return false;
}

interface State {
  checkedCompletionStatus: boolean;
}

class AppContainer extends Component<Props, State> {
  public state = {
    checkedCompletionStatus: false,
  };

  public componentDidMount() {
    handleSignInCompletion(this.props);
    this.setState({ checkedCompletionStatus: true });
  }
  public componentDidUpdate() {
    handleSignInCompletion(this.props);
  }

  public render() {
    const {
      local: { view },
      auth,
    } = this.props;
    // We skip first frame to check for completion status.
    if (!this.state.checkedCompletionStatus) {
      return null;
    }
    return <App view={view} auth={auth} />;
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment AppContainerLocal on Local {
      authToken
      view
    }
  `
)(
  withFragmentContainer<Props>({
    auth: graphql`
      fragment AppContainer_auth on Auth {
        ...SignInContainer_auth
        ...SignUpContainer_auth
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
    me: graphql`
      fragment AppContainer_me on User {
        username
        email
        profiles {
          __typename
        }
      }
    `,
  })(withSetViewMutation(withCompleteSignInMutation(AppContainer)))
);

export default enhanced;
