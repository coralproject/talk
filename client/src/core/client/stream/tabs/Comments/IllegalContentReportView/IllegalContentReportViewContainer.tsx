import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useMemo,
} from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { parseBool } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import { ViewFullDiscussionEvent } from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";
import { AddIcon, ArrowLeftIcon, SvgIcon } from "coral-ui/components/icons";
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

interface Props {
  comment: CommentData | null;
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
  refreshStream: boolean | null;
}

const IllegalContentReportViewContainer: FunctionComponent<Props> = (props) => {
  const { comment, story, viewer, settings } = props;
  const setCommentID = useMutation(SetCommentIDMutation);
  const { eventEmitter, window } = useCoralContext();

  const onShowAllComments = useCallback(
    (e: MouseEvent<any>) => {
      ViewFullDiscussionEvent.emit(eventEmitter, {
        commentID: comment && comment.id,
      });
      void setCommentID({ id: null });
      // remove view param too
      e.preventDefault();
    },
    [comment, eventEmitter, setCommentID]
  );

  const showAllCommentsHref = useMemo(() => {
    const url = window.location.href;
    return getURLWithCommentID(url, undefined);
  }, [window.location.href]);

  const commentVisible = comment && isPublished(comment.status);

  const onSubmit = useCallback(() => {}, []);

  const onAdditionalCommentsClick = useCallback(() => {}, []);

  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.permalinkView.$root, {
        [CLASSES.permalinkView.authenticated]: Boolean(viewer),
        [CLASSES.permalinkView.unauthenticated]: !viewer,
      })}
      size="double"
    >
      <UserBoxContainer viewer={viewer} settings={settings} />
      {/* TODO: Update this localization */}
      <Localized
        id="comments-permalinkView-section"
        attrs={{ "aria-label": true }}
      >
        <HorizontalGutter
          size="double"
          container="section"
          // aria-label="Single Conversation"
        >
          <Flex
            alignItems="flex-start"
            direction="column"
            className={styles.header}
          >
            {/* TODO: This should become Back to comments link */}
            {showAllCommentsHref && (
              // TODO: Update this button referencing permalink discussion
              // <Localized id="comments-permalinkView-viewFullDiscussion">
              <Button
                // className={CLASSES.permalinkView.viewFullDiscussionButton}
                variant="flat"
                color="primary"
                fontSize="medium"
                fontWeight="semiBold"
                onClick={onShowAllComments}
                href={showAllCommentsHref}
                paddingSize="none"
                target="_parent"
                anchor
                underline
              >
                <SvgIcon Icon={ArrowLeftIcon} />
                Back to comments
              </Button>
              // {/* </Localized> */}
            )}
            {/* TODO: Localize all of this and apply styles */}
            <div className={styles.title}>Report illegal content</div>
            <p className={styles.description}>
              Under the Digital Services Act (DSA), you can now report illegal
              content that you see in the comments. Please fill this form out to
              the best of your ability so our moderation team can make a
              decision and if necessary consult with out site's legal
              department. Thank you for your support in making our communities
              safer to engage in.
            </p>
            <div className={styles.reporting}>
              You are reporting this content
            </div>
          </Flex>
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
        </HorizontalGutter>
      </Localized>
      <Form onSubmit={onSubmit}>
        {({
          handleSubmit,
          submitting,
          hasValidationErrors,
          form,
          submitError,
        }) => (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            id="report-illegal-content-form"
          >
            <HorizontalGutter spacing={4}>
              <FormField>
                <Field
                  name="lawDetails"
                  validate={required}
                  id="reportIllegalContent-lawDetails"
                >
                  {({ input }) => (
                    <>
                      {/* <Localized id="profile-changeUsername-confirmNewUsername-label"> */}
                      <InputLabel htmlFor={input.name}>
                        What law do you believe has been broken? (required)
                      </InputLabel>
                      {/* </Localized> */}
                      <TextField {...input} fullWidth id={input.name} />
                    </>
                  )}
                </Field>
              </FormField>
              <FormField>
                <Field name="additionalIllegalContentInfo" validate={required}>
                  {({ input }) => (
                    <>
                      <InputLabel htmlFor={input.name}>
                        Please include additional information why this comment
                        is illegal (required)
                      </InputLabel>
                      <HelperText>
                        To the best of your ability please give as much detail
                        to help us investigate this further.
                      </HelperText>
                      <TextArea
                        className={styles.additionalInfo}
                        name={input.name}
                      />
                    </>
                  )}
                </Field>
              </FormField>
              <FormField>
                <InputLabel>
                  Have other comments you'd like to report for breaking this
                  law?
                </InputLabel>
                <Button
                  color="primary"
                  variant="outlined"
                  fontSize="small"
                  paddingSize="small"
                  upperCase
                  onClick={onAdditionalCommentsClick}
                >
                  <SvgIcon Icon={AddIcon} />
                  Add additional comments
                </Button>
              </FormField>
              <FormField>
                <Field
                  name="bonafideBeliefStatement"
                  type="checkbox"
                  parse={parseBool}
                >
                  {({ input }) => (
                    // <Localized id="configure-general-rte-strikethrough">
                    <CheckBox {...input} id={input.name}>
                      Bonafide belief statement
                    </CheckBox>
                    // </Localized>
                  )}
                </Field>
              </FormField>
            </HorizontalGutter>
            <Flex alignItems="center" justifyContent="flex-end">
              {/* <Localized id="comments-reportPopover-submit"> */}
              <Button
                color="secondary"
                variant="filled"
                fontSize="small"
                paddingSize="small"
                type="submit"
                disabled={submitting || hasValidationErrors}
                upperCase
              >
                Submit Report
              </Button>
              {/* </Localized> */}
            </Flex>
          </form>
        )}
      </Form>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment IllegalContentReportViewContainer_story on Story {
      id
      ...CommentContainer_story
    }
  `,
  comment: graphql`
    fragment IllegalContentReportViewContainer_comment on Comment {
      id
      status
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
