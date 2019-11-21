import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import {
  useMutation,
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import SetAuthPopupStateMutation from "coral-stream/common/UserBox/SetAuthPopupStateMutation";
import ShowAuthPopupMutation from "coral-stream/mutations/ShowAuthPopupMutation";
import { Popup } from "coral-ui/components";

import { ChangePasswordContainer_organization as OrganizationData } from "coral-stream/__generated__/ChangePasswordContainer_organization.graphql";
import { ChangePasswordContainerLocal } from "coral-stream/__generated__/ChangePasswordContainerLocal.graphql";

import ChangePassword from "./ChangePassword";

interface Props {
  local: ChangePasswordContainerLocal;
  organization: OrganizationData;
}

const ChangePasswordContainer: FunctionComponent<Props> = ({
  organization,
  local: {
    authPopup: { open, focus, view },
  },
}) => {
  const setAuthPopupState = useMutation(SetAuthPopupStateMutation);
  const showAuthPopup = useMutation(ShowAuthPopupMutation);
  const onResetPassword = useCallback(() => {
    showAuthPopup({ view: "FORGOT_PASSWORD" });
  }, [showAuthPopup]);
  const onFocus = useCallback(() => {
    setAuthPopupState({ focus: true });
  }, [setAuthPopupState]);
  const onBlur = useCallback(() => {
    setAuthPopupState({ focus: true });
  }, [setAuthPopupState]);
  const onClose = useCallback(() => {
    setAuthPopupState({ open: false });
  }, [setAuthPopupState]);

  if (
    !organization.auth.integrations.local.enabled ||
    !organization.auth.integrations.local.targetFilter.stream
  ) {
    return null;
  }

  return (
    <>
      <Popup
        href={`${urls.embed.auth}?view=${view}`}
        title="Coral Auth"
        open={open}
        focus={focus}
        onFocus={onFocus}
        onBlur={onBlur}
        onClose={onClose}
      />
      <ChangePassword onResetPassword={onResetPassword} />
    </>
  );
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment ChangePasswordContainerLocal on Local {
      authPopup {
        open
        focus
        view
      }
    }
  `
)(
  withFragmentContainer<Props>({
    organization: graphql`
      fragment ChangePasswordContainer_organization on Organization {
        auth {
          integrations {
            local {
              enabled
              targetFilter {
                stream
              }
            }
          }
        }
      }
    `,
  })(ChangePasswordContainer)
);

export default enhanced;
