import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useUUID } from "coral-framework/hooks";
import { parseBool } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import {
  CheckBox,
  Flex,
  FormField,
  HelperText,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";
import { Button, CallOut, TextArea } from "coral-ui/components/v3";

import { IllegalContentReportViewContainer_comment as CommentData } from "coral-stream/__generated__/IllegalContentReportViewContainer_comment.graphql";
import { IllegalContentReportViewContainer_settings as SettingsData } from "coral-stream/__generated__/IllegalContentReportViewContainer_settings.graphql";
import { IllegalContentReportViewContainer_story as StoryData } from "coral-stream/__generated__/IllegalContentReportViewContainer_story.graphql";
import { IllegalContentReportViewContainer_viewer as ViewerData } from "coral-stream/__generated__/IllegalContentReportViewContainer_viewer.graphql";

import { isPublished } from "../helpers";

import styles from "./IllegalContentReportViewContainer.css";

import { CommentContainer } from "../Comment";
import DeletedTombstoneContainer from "../DeletedTombstoneContainer";
import IgnoredTombstoneOrHideContainer from "../IgnoredTombstoneOrHideContainer";
import RejectedTombstoneContainer from "../PermalinkView/RejectedTombstoneContainer";
import AddAdditionalComments from "./AddAdditionalComments";
import CreateDSAReportMutation from "./CreateDSAReportMutation";

interface Props {
  comment: CommentData | null;
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
  refreshStream: boolean | null;
}

interface FormProps {
  lawBrokenDescription: string;
  additionalInformation: string;
}

const IllegalContentReportViewContainer: FunctionComponent<Props> = (props) => {
  const { comment, story, viewer, settings } = props;
  const createDSAReport = useMutation(CreateDSAReportMutation);
  const [additionalComments, setAdditionalComments] = useState<
    null | { id: string; url: string }[]
  >(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    { id: string; status: string; error?: any; url: string }[]
  >([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submissionID = useUUID();

  const commentVisible = comment && isPublished(comment.status);

  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      const statuses = [];
      if (viewer && comment) {
        if (additionalComments) {
          for (const c of additionalComments) {
            try {
              await createDSAReport({
                userID: viewer.id,
                commentID: c.id,
                lawBrokenDescription: input.lawBrokenDescription,
                additionalInformation: input.additionalInformation,
                submissionID,
              });
              statuses.push({ id: c.id, status: "success", url: c.url });
            } catch (e) {
              statuses.push({
                id: c.id,
                status: "error",
                error: e,
                url: c.url,
              });
            }
          }
        }
        const url = getURLWithCommentID(story.url, comment.id);
        try {
          await createDSAReport({
            userID: viewer.id,
            commentID: comment.id,
            lawBrokenDescription: input.lawBrokenDescription,
            additionalInformation: input.additionalInformation,
            submissionID,
            commentRevisionID: comment.revision?.id,
          });
          statuses.push({ id: comment.id, status: "success", url });
        } catch (e) {
          statuses.push({ id: comment.id, status: "error", error: e, url });
        }
        setSubmissionStatus(statuses);
        setIsSubmitted(true);
      }
    },
    [
      additionalComments,
      viewer,
      comment,
      createDSAReport,
      setSubmissionStatus,
      setIsSubmitted,
      submissionID,
      story.url,
    ]
  );

  const onAddAdditionalComment = useCallback(
    (id: string, url: string) => {
      if (additionalComments) {
        setAdditionalComments([...additionalComments, { id, url }]);
      } else {
        setAdditionalComments([{ id, url }]);
      }
    },
    [setAdditionalComments, additionalComments]
  );

  const onDeleteAdditionalComment = useCallback(
    (id: string) => {
      if (additionalComments) {
        setAdditionalComments(additionalComments?.filter((c) => c.id !== id));
      }
    },
    [setAdditionalComments, additionalComments]
  );

  if (isSubmitted) {
    return (
      <>
        {/* TODO: Localize and update to add in any errors and style based on design */}
        <div>
          You have successfully submitted your illegal content report for the
          following comments:
        </div>
        {submissionStatus
          .filter((submission) => submission.status === "success")
          .map((c) => {
            return <div key={c.id}>{c.url}</div>;
          })}
        <div>The following comments were submitted with errors:</div>
        {submissionStatus
          .filter((submission) => submission.status === "error")
          .map((c) => {
            return (
              <div key={c.id}>
                <div>{c.url}</div>
                {c.error.message && <div>Error: {c.error.message}</div>}
              </div>
            );
          })}
      </>
    );
  }

  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.permalinkView.$root, {
        [CLASSES.permalinkView.authenticated]: Boolean(viewer),
        [CLASSES.permalinkView.unauthenticated]: !viewer,
      })}
    >
      <UserBoxContainer viewer={viewer} settings={settings} />
      <Localized id="comments-permalinkView-reportIllegalContent-title">
        <div className={styles.title}>Report illegal content</div>
      </Localized>
      <Localized id="comments-permalinkView-reportIllegalContent-description">
        <p className={styles.description}>
          Under the Digital Services Act (DSA), you can now report illegal
          content that you see in the comments. Please fill this form out to the
          best of your ability so our moderation team can make a decision and if
          necessary consult with out site's legal department. Thank you for your
          support in making our communities safer to engage in.
        </p>
      </Localized>
      {/* TODO: Add localization and update to actual copy and link to go to */}
      <Button
        variant="flat"
        color="primary"
        fontSize="medium"
        fontWeight="semiBold"
        // href={showAllCommentsHref}
        paddingSize="none"
        target="_blank"
        anchor
        underline
      >
        Some link
      </Button>
      <Localized id="comments-permalinkView-reportIllegalContent-reportingComment">
        <div className={styles.reporting}>You are reporting this comment</div>
      </Localized>
      {!commentVisible && (
        <CallOut aria-live="polite">
          <Localized id="comments-permalinkView-commentRemovedOrDoesNotExist">
            This comment has been removed or does not exist.
          </Localized>
        </CallOut>
      )}
      {comment && commentVisible && (
        <HorizontalGutter>
          <IgnoredTombstoneOrHideContainer
            viewer={viewer}
            comment={comment}
            allowTombstoneReveal
          >
            <RejectedTombstoneContainer comment={comment}>
              <DeletedTombstoneContainer comment={comment}>
                <CommentContainer
                  comment={comment}
                  story={story}
                  viewer={viewer}
                  settings={settings}
                  highlight
                  hideModerationCarat
                  hideReportButton
                  hideReactionButton
                  hideReplyButton
                  hideShareButton
                  showCopyIllegalContentReportLinkButton
                />
              </DeletedTombstoneContainer>
            </RejectedTombstoneContainer>
          </IgnoredTombstoneOrHideContainer>
        </HorizontalGutter>
      )}

      <>
        <CallOut>
          <Localized id="comments-permalinkView-reportIllegalContent-callout-needMoreTime">
            <div>Need more time to submit your report?</div>
          </Localized>
          <Localized id="comments-permalinkView-reportIllegalContent-callout-useCopyLink">
            <p>
              Use the "Copy link" button above to grab the URL to this comment
              for you to come back to when you're ready (should note that it
              does not save your progress).
            </p>
          </Localized>
        </CallOut>
        <Localized id="comments-permalinkView-reportIllegalContent-directions">
          <div className={styles.directions}>Directions</div>
        </Localized>
        <Localized id="comments-permalinkView-reportIllegalContent-directions-moreInfo">
          <p className={styles.directionsMoreInfo}>
            Another chance to give some instructions on what is required for
            this form. Maybe some reference or links to the laws? Unclear at
            this point.
          </p>
        </Localized>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, hasValidationErrors }) => (
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              id="report-illegal-content-form"
            >
              <HorizontalGutter spacing={4}>
                <FormField>
                  <Field
                    name="lawBrokenDescription"
                    validate={required}
                    id="reportIllegalContent-lawBrokenDescription"
                  >
                    {({ input }) => (
                      <>
                        <Localized id="comments-permalinkView-reportIllegalContent-lawBrokenDescription-inputLabel">
                          <InputLabel htmlFor={input.name}>
                            What law do you believe has been broken? (required)
                          </InputLabel>
                        </Localized>
                        <TextField {...input} fullWidth id={input.name} />
                      </>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Field
                    name="additionalInformation"
                    validate={required}
                    id="reportIllegalContent-additionalInformation"
                  >
                    {({ input }) => (
                      <>
                        <Localized id="comments-permalinkView-reportIllegalContent-additionalInformation-inputLabel">
                          <InputLabel htmlFor={input.name}>
                            Please include additional information why this
                            comment is illegal (required)
                          </InputLabel>
                        </Localized>
                        <Localized id="comments-permalinkView-reportIllegalContent-additionalInformation-helperText">
                          <HelperText>
                            To the best of your ability please give as much
                            detail to help us investigate this further.
                          </HelperText>
                        </Localized>
                        <TextArea
                          data-testid="additionalInfo"
                          className={styles.additionalInfo}
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                        />
                      </>
                    )}
                  </Field>
                </FormField>
                <AddAdditionalComments
                  onAddAdditionalComment={onAddAdditionalComment}
                  onDeleteAdditionalComment={onDeleteAdditionalComment}
                  additionalComments={additionalComments}
                  comment={comment}
                />
                <FormField>
                  <Field
                    name="bonafideBeliefStatement"
                    type="checkbox"
                    parse={parseBool}
                    validate={required}
                  >
                    {({ input }) => (
                      <Localized id="comments-permalinkView-reportIllegalContent-bonafideBelief-checkbox">
                        <CheckBox {...input} id={input.name}>
                          Bonafide belief statement
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
                </FormField>
              </HorizontalGutter>
              {submissionStatus
                .filter((s) => s.status === "error")
                .map((submitError) => {
                  return (
                    <div key={submitError.id}>{submitError.error.message}</div>
                  );
                })}
              <Flex alignItems="center" justifyContent="flex-end">
                <Localized id="comments-permalinkView-reportIllegalContent-submit">
                  <Button
                    color="secondary"
                    variant="filled"
                    fontSize="small"
                    paddingSize="small"
                    type="submit"
                    disabled={submitting || hasValidationErrors}
                    upperCase
                  >
                    Submit report
                  </Button>
                </Localized>
              </Flex>
            </form>
          )}
        </Form>
      </>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment IllegalContentReportViewContainer_story on Story {
      id
      url
      ...CommentContainer_story
    }
  `,
  comment: graphql`
    fragment IllegalContentReportViewContainer_comment on Comment {
      id
      status
      revision {
        id
      }
      ...RejectedTombstoneContainer_comment
      ...IgnoredTombstoneOrHideContainer_comment
      ...DeletedTombstoneContainer_comment
      ...CommentContainer_comment
    }
  `,
  viewer: graphql`
    fragment IllegalContentReportViewContainer_viewer on User {
      id
      ...UserBoxContainer_viewer
      ...CreateCommentMutation_viewer
      ...CreateCommentReplyMutation_viewer
      ...IgnoredTombstoneOrHideContainer_viewer
      ...CommentContainer_viewer
    }
  `,
  settings: graphql`
    fragment IllegalContentReportViewContainer_settings on Settings {
      ...UserBoxContainer_settings
      ...CommentContainer_settings
    }
  `,
})(IllegalContentReportViewContainer);

export default enhanced;
