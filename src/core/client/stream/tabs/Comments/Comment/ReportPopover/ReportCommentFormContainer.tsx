import { EventEmitter2 } from "eventemitter2";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { withContext } from "coral-framework/lib/bootstrap";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import { ShowReportPopoverEvent } from "coral-stream/events";

import { ReportCommentFormContainer_comment as CommentData } from "coral-stream/__generated__/ReportCommentFormContainer_comment.graphql";

import {
  CreateCommentDontAgreeMutation,
  withCreateCommentDontAgreeMutation,
} from "./CreateCommentDontAgreeMutation";
import {
  CreateCommentFlagMutation,
  withCreateCommentFlagMutation,
} from "./CreateCommentFlagMutation";
import ReportCommentForm from "./ReportCommentForm";
import ThankYou from "./ThankYou";

interface Props {
  eventEmitter: EventEmitter2;
  comment: CommentData;
  createCommentFlag: CreateCommentFlagMutation;
  createCommentDontAgree: CreateCommentDontAgreeMutation;
  onClose: () => void;
  onResize: () => void;
}

interface State {
  done: boolean;
}

export class ReportCommentFormContainer extends Component<Props, State> {
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
          // revision is guaranteed since we are able to interact with it
          commentRevisionID: this.props.comment.revision!.id,
          additionalDetails: input.additionalDetails,
        });
      } else {
        await this.props.createCommentFlag({
          commentID: this.props.comment.id,
          // revision is guaranteed since we are able to interact with it
          commentRevisionID: this.props.comment.revision!.id,
          reason: input.reason,
          additionalDetails: input.additionalDetails,
        });
      }
      this.setState({ done: true });
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        return error.invalidArgs;
      }
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return undefined;
  };

  public componentDidMount() {
    ShowReportPopoverEvent.emit(this.props.eventEmitter, {
      commentID: this.props.comment.id,
    });
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    // Reposition popper after switching view.
    if (this.state.done && !prevState.done) {
      this.props.onResize();
    }
  }

  public render() {
    if (!this.state.done) {
      return (
        <ReportCommentForm
          id={this.props.comment.id}
          onSubmit={this.handleOnSubmit}
          onCancel={this.props.onClose}
          onResize={this.props.onResize}
        />
      );
    }
    return <ThankYou onDismiss={this.props.onClose} />;
  }
}

const enhanced = withContext(({ eventEmitter }) => ({
  eventEmitter,
}))(
  withCreateCommentDontAgreeMutation(
    withCreateCommentFlagMutation(
      withFragmentContainer<Props>({
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
  )
);
export type ReportCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
