import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { MemberBioContainer_user$key as MemberBioContainer_user } from "coral-admin/__generated__/MemberBioContainer_user.graphql";

import styles from "./MemberBioContainer.css";

interface Props {
  user: MemberBioContainer_user;
}

const MemberBioContainer: FunctionComponent<Props> = ({ user }) => {
  const userData = useFragment(
    graphql`
      fragment MemberBioContainer_user on User {
        bio
      }
    `,
    user
  );

  if (!userData.bio) {
    return null;
  }
  return (
    <div>
      <Localized id="moderate-user-drawer-bio-title">
        <h3 className={styles.title}>Member Bio</h3>
      </Localized>
      <div className={styles.contents}>{userData.bio}</div>
    </div>
  );
};

export default MemberBioContainer;
