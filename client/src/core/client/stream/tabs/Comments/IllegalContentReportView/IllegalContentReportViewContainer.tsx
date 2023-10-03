import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi } from "final-form";
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Field, Form, FormProps } from "react-final-form";
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
import {
  AddIcon,
  ArrowLeftIcon,
  ButtonSvgIcon,
} from "coral-ui/components/icons";
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
  const [showAddAdditionalComment, setShowAddAdditionalComment] =
    useState(false);
  const [additionalComments, setAdditionalComments] = useState<null | string[]>(
    null
  );

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

  const onSubmit = useCallback((input: FormProps, form: FormApi) => {}, []);

  const onAddCommentURL = useCallback(
    (values: Record<string, any>) => {
      if (values.additionalComment) {
        // TODO: validate
        // if passes validation, add to additionalComments
        if (additionalComments) {
          setAdditionalComments([
            ...additionalComments,
            values.additionalComment,
          ]);
        } else {
          setAdditionalComments([values.additionalComment]);
        }
      }
      // TODO: also want to clear what was previously entered in the text box for this value
      if (additionalComments && additionalComments.length < 9) {
        setShowAddAdditionalComment(false);
      }
      // TODO: show a validation message if no value or value doesn't pass validation
    },
    [setAdditionalComments, additionalComments, setShowAddAdditionalComment]
  );

  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.permalinkView.$root, {
        [CLASSES.permalinkView.authenticated]: Boolean(viewer),
        [CLASSES.permalinkView.unauthenticated]: !viewer,
      })}
    >
      <UserBoxContainer viewer={viewer} settings={settings} />
      {showAllCommentsHref && (
        <Localized
          id="comments-permalinkView-reportIllegalContent-backToComments"
          elems={{
            Button: (
              <ButtonSvgIcon
                className={styles.leftIcon}
                Icon={ArrowLeftIcon}
                size="xs"
              />
            ),
          }}
        >
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
            <ButtonSvgIcon
              className={styles.leftIcon}
              Icon={ArrowLeftIcon}
              size="xs"
            />
            Back to comments
          </Button>
        </Localized>
      )}
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
      {/* TODO: Localize and update styles */}
      <CallOut>
        <div>Need more time to submit your report?</div>
        <p>
          Use the "Copy link" button above to grab the URL to this comment for
          you to come back to when you're ready (should note that it does not
          save your progress).
        </p>
      </CallOut>
      {/* Localize */}
      <div className={styles.directions}>Directions</div>
      <p className={styles.directionsMoreInfo}>
        Another chance to give some instructions on what is required for this
        form. Maybe some reference or links to the laws? Unclear at this point.
      </p>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, hasValidationErrors, values }) => (
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
                      <Localized id="comments-permalinkView-reportIllegalContent-lawDetails-inputLabel">
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
                  name="additionalInfo"
                  validate={required}
                  id="reportIllegalContent-additionalInfo"
                >
                  {({ input }) => (
                    <>
                      <Localized id="comments-permalinkView-reportIllegalContent-additionalInfo-inputLabel">
                        <InputLabel htmlFor={input.name}>
                          Please include additional information why this comment
                          is illegal (required)
                        </InputLabel>
                      </Localized>
                      <Localized id="comments-permalinkView-reportIllegalContent-additionalInfo-helperText">
                        <HelperText>
                          To the best of your ability please give as much detail
                          to help us investigate this further.
                        </HelperText>
                      </Localized>
                      <TextArea
                        className={styles.additionalInfo}
                        name={input.name}
                        value={input.value}
                        onChange={input.onChange}
                      />
                    </>
                  )}
                </Field>
              </FormField>
              <Localized id="comments-permalinkView-reportIllegalContent-additionalComments-inputLabel">
                <InputLabel>
                  Have other comments you'd like to report for breaking this
                  law?
                </InputLabel>
              </Localized>
              {additionalComments &&
                additionalComments.map((additionalComment) => {
                  // TODO: Add styles
                  return <p key={additionalComment}>{additionalComment}</p>;
                })}
              <>
                {showAddAdditionalComment ? (
                  <>
                    <Field
                      name={`additionalComment`}
                      // TODO: validate that it's a valid share url
                      // validate uniqueness as well here?
                      // validate={required}
                      id={`reportIllegalContent-additionalComment`}
                    >
                      {({ input }: any) => (
                        <>
                          <Localized id="">
                            <InputLabel htmlFor={input.name}>
                              Comment URL
                            </InputLabel>
                          </Localized>
                          <TextField
                            {...input}
                            fullWidth
                            id={input.name}
                            value={input.value}
                          />
                        </>
                      )}
                    </Field>
                    {/* // TODO: Update localized */}
                    <Localized
                      id="comments-permalinkView-reportIllegalContent-additionalComments-"
                      elems={{
                        Button: (
                          <ButtonSvgIcon
                            Icon={AddIcon}
                            size="xs"
                            className={styles.leftIcon}
                          />
                        ),
                      }}
                    >
                      <Button
                        color="primary"
                        variant="outlined"
                        fontSize="small"
                        paddingSize="small"
                        upperCase
                        onClick={() => onAddCommentURL(values)}
                      >
                        <ButtonSvgIcon
                          Icon={AddIcon}
                          size="xs"
                          className={styles.leftIcon}
                        />
                        Add comment URL
                      </Button>
                    </Localized>
                  </>
                ) : (
                  <Localized
                    id="comments-permalinkView-reportIllegalContent-additionalComments-button"
                    elems={{
                      Button: (
                        <ButtonSvgIcon
                          Icon={AddIcon}
                          size="xs"
                          className={styles.leftIcon}
                        />
                      ),
                    }}
                  >
                    <Button
                      color="primary"
                      variant="outlined"
                      fontSize="small"
                      paddingSize="small"
                      upperCase
                      onClick={() => setShowAddAdditionalComment(true)}
                    >
                      <ButtonSvgIcon
                        Icon={AddIcon}
                        size="xs"
                        className={styles.leftIcon}
                      />
                      Add additional comments
                    </Button>
                  </Localized>
                )}
              </>
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
