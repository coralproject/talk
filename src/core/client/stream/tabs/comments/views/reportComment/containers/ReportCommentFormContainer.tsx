import React, { Component } from "react";
import { graphql } from "react-relay";

import { BadUserInputError } from "talk-framework/lib/errors";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { ReportCommentFormContainer_comment as CommentData } from "talk-stream/__generated__/ReportCommentFormContainer_comment.graphql";

import {
  CreateCommentDontAgreeMutation,
  CreateCommentFlagMutation,
  withCreateCommentDontAgreeMutation,
  withCreateCommentFlagMutation,
} from "talk-stream/mutations";
import ReportCommentForm from "../components/ReportCommentForm";
import ThankYou from "../components/ThankYou";

interface InnerProps {
  comment: CommentData;
  createCommentFlag: CreateCommentFlagMutation;
  createCommentDontAgree: CreateCommentDontAgreeMutation;
  onClose: () => void;
  onResize: () => void;
}

interface State {
  done: boolean;
}

export class ReportCommentFormContainer extends Component<InnerProps, State> {
  public state = {
    done: false,
  };

  private handleOnSubmit: PropTypesOf<
    typeof ReportCommentForm
  >["onSubmit"] = async (input, form) => {
    try {
      if (input.reason === "DISAGREE") {
        await this.props.createCommentDontAgree({
          commentID: this.props.comment.id,
          commentRevisionID: this.props.comment.revision.id,
          additionalDetails: input.additionalDetails,
        });
      } else {
        await this.props.createCommentFlag({
          commentID: this.props.comment.id,
          commentRevisionID: this.props.comment.revision.id,
          reason: input.reason,
          additionalDetails: input.additionalDetails,
        });
      }

      this.setState({ done: true });
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };

  public render() {
    if (!this.state.done) {
      return (
        <ReportCommentForm
          onSubmit={this.handleOnSubmit}
          onCancel={this.props.onClose}
          onResize={this.props.onResize}
        />
      );
    }
    return <ThankYou onDismiss={this.props.onClose} />;
  }
}

const enhanced = withCreateCommentDontAgreeMutation(
  withCreateCommentFlagMutation(
    withFragmentContainer<InnerProps>({
      comment: graphql`
        fragment ReportCommentFormContainer_comment on Comment {
          id
          revision {
            id
          }
        }
      `,
    })(ReportCommentFormContainer)
  )
);
export type ReportCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
