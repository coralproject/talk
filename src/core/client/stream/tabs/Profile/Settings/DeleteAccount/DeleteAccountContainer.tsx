import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Button } from "coral-ui/components/Button";

import { DeleteAccountContainer_viewer } from "coral-stream/__generated__/DeleteAccountContainer_viewer.graphql";

import { Icon, Typography } from "coral-ui/components";
import DeleteAccountPopover from "./DeleteAccountModal";

import styles from "./DeleteAccountContainer.css";

interface Props {
  viewer: DeleteAccountContainer_viewer;
}

const DeleteAccountContainer: FunctionComponent<Props> = ({ viewer }) => {
  const [deletePopoverVisible, setDeletePopoverVisible] = useState(false);

  const showPopover = useCallback(() => {
    setDeletePopoverVisible(true);
  }, [setDeletePopoverVisible]);
  const hidePopover = useCallback(() => {
    setDeletePopoverVisible(false);
  }, [setDeletePopoverVisible]);

  return (
    <>
      <DeleteAccountPopover
        userID={viewer.id}
        open={deletePopoverVisible}
        onClose={hidePopover}
      />

      <Localized id="profile-settings-deleteAccount-title">
        <Typography variant="heading3">Delete My Account</Typography>
      </Localized>
      <Localized id="profile-settings-deleteAccount-description">
        <Typography variant="bodyCopy">
          Deleting your account will permanently erase your profile and remove
          all your comments from this site.
        </Typography>
      </Localized>

      <Button variant="outlined" size="small" onClick={showPopover}>
        <Localized
          id="profile-settings-deleteAccount-requestDelete-icon"
          attrs={{ title: true }}
        >
          <Icon size="sm" className={styles.icon}>
            cancel
          </Icon>
        </Localized>
        <Localized id="profile-settings-deleteAccount-requestDelete">
          <span>Request account deletion</span>
        </Localized>
      </Button>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment DeleteAccountContainer_viewer on User {
      id
    }
  `,
})(DeleteAccountContainer);

export default enhanced;
