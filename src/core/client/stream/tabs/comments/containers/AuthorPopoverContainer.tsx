import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { AuthorPopoverContainer_author as AuthorData } from "coral-stream/__generated__/AuthorPopoverContainer_author.graphql";

import AuthorPopover from "../components/Comment/AuthorPopover";

interface Props {
  author: AuthorData;
}

export const AuthorPopoverContainer: FunctionComponent<Props> = ({
  author,
}) => {
  return (
    <AuthorPopover
      createdAt={author.createdAt}
      username={author.username || <NotAvailable />}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  author: graphql`
    fragment AuthorPopoverContainer_author on User {
      username
      createdAt
    }
  `,
})(AuthorPopoverContainer);

export default enhanced;
