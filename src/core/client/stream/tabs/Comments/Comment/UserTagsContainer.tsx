import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { GQLSTORY_MODE } from "coral-framework/schema";
import { Flex, Icon, Tag } from "coral-ui/components/v2";

import { UserTagsContainer_comment } from "coral-stream/__generated__/UserTagsContainer_comment.graphql";
import { UserTagsContainer_settings } from "coral-stream/__generated__/UserTagsContainer_settings.graphql";
import { UserTagsContainer_story } from "coral-stream/__generated__/UserTagsContainer_story.graphql";

import styles from "./UserTagsContainer.css";

interface Props {
  story: UserTagsContainer_story;
  comment: UserTagsContainer_comment;
  settings: UserTagsContainer_settings;
  className?: string;
}

function storyIsInQAMode(story: UserTagsContainer_story) {
  return story.settings.mode === GQLSTORY_MODE.QA;
}

function hasStaffTag(comment: UserTagsContainer_comment) {
  return comment.tags.find((t) => t.code === "STAFF");
}

function hasExpertTag(
  story: UserTagsContainer_story,
  comment: UserTagsContainer_comment
) {
  const isQA = storyIsInQAMode(story);
  return isQA && comment.tags.find((t) => t.code === "EXPERT");
}

// The comment and story params are `any` because relay
// isn't smart enough to see that the nested fragments
// on the comment container are compatible.
export function commentHasTags(story: any, comment: any) {
  const staffTag = hasStaffTag(comment);
  const expertTag = hasExpertTag(story, comment);
  const hasTags = staffTag || expertTag;

  return hasTags;
}

const UserTagsContainer: FunctionComponent<Props> = ({
  story,
  settings,
  comment,
  className,
}) => {
  const staffTag = hasStaffTag(comment);
  const expertTag = hasExpertTag(story, comment);
  const hasTags = commentHasTags(story, comment);

  if (!hasTags) {
    return null;
  }

  return (
    <Flex alignItems="center">
      {expertTag && (
        <Tag variant="regular" color="primary" className={styles.tag}>
          <Flex alignItems="center">
            <Icon size="xs" className={styles.icon}>
              star
            </Icon>
            <Localized id="qa-expert-tag">expert</Localized>
          </Flex>
        </Tag>
      )}
      {staffTag && (
        <Tag className={cn(className, styles.tag)}>{settings.staff.label}</Tag>
      )}
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment UserTagsContainer_comment on Comment {
      tags {
        code
      }
    }
  `,
  story: graphql`
    fragment UserTagsContainer_story on Story {
      settings {
        mode
      }
    }
  `,
  settings: graphql`
    fragment UserTagsContainer_settings on Settings {
      staff {
        label
      }
    }
  `,
})(UserTagsContainer);

export default enhanced;
