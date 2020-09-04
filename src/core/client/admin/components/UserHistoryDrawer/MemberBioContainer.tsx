import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { Markdown } from "coral-framework/components";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { MemberBioContainer_user } from "coral-admin/__generated__/MemberBioContainer_user.graphql";

import styles from "./MemberBioContainer.css";

interface Props {
  user: MemberBioContainer_user;
}

const MemberBioContainer: FunctionComponent<Props> = ({ user }) => {
  if (!user.bio) {
    return null;
  }
  return (
    <div>
      <Localized id="moderate-user-drawer-bio-title">
        <h3 className={styles.title}>Member Bio</h3>
      </Localized>
      <Markdown className={styles.contents}>{user.bio}</Markdown>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment MemberBioContainer_user on User {
      bio
    }
  `,
})(MemberBioContainer);

export default enhanced;
