import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { ReportCommentFormContainer_comment } from "coral-stream/__generated__/ReportCommentFormContainer_comment.graphql";

import CreateCommentDisagreeMutation from "./CreateCommentDisagreeMutation";
import CreateCommentFlagMutation from "./CreateCommentFlagMutation";
import ReportCommentForm from "./ReportCommentForm";

interface Props {
  comment: ReportCommentFormContainer_comment;
  onClose: () => void;
}

const ReportCommentFormContainer: FunctionComponent<Props> = ({
  comment,
  onClose,
}) => {
  const [done, setDone] = useState(false);
  const dontAgreeMutation = useMutation(CreateCommentDisagreeMutation);
  const flagMutation = useMutation(CreateCommentFlagMutation);

  const onSubmit = useCallback(
    async (input, form) => {
      try {
        if (input.reason === "DISAGREE") {
          await dontAgreeMutation({
            commentID: comment.id,
            // revision is guaranteed since we are able to interact with it
            commentRevisionID: comment.revision!.id,
            additionalDetails: input.additionalDetails,
          });
        } else {
          await flagMutation({
            commentID: comment.id,
            // revision is guaranteed since we are able to interact with it
            commentRevisionID: comment.revision!.id,
            reason: input.reason,
            additionalDetails: input.additionalDetails,
          });
        }
        setDone(true);
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          return error.invalidArgs;
        }
        // eslint-disable-next-line no-console
        console.error(error);
      }

      return undefined;
    },
    [setDone]
  );

  if (!done) {
    return (
      <ReportCommentForm
        id={comment.id}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    );
  }

  return (
    <CallOut
      color="positive"
      title={
        <Localized id="comments-reportPopover-thankYou">Thank you!</Localized>
      }
      onClose={onClose}
      icon={<Icon size="sm">check_circle</Icon>}
    >
      <Localized id="comments-reportPopover-receivedMessage">
        We’ve received your message. Reports from members like you keep the
        community safe.
      </Localized>
    </CallOut>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ReportCommentFormContainer_comment on Comment {
      id
      revision {
        id
      }
    }
  `,
})(ReportCommentFormContainer);

export default enhanced;
