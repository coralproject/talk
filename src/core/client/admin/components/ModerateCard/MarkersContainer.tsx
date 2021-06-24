import { Localized } from "@fluent/react/compat";
import React, { useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Flex,
  HorizontalGutter,
  Marker,
  MarkerCount,
} from "coral-ui/components/v2";

import { MarkersContainer_comment } from "coral-admin/__generated__/MarkersContainer_comment.graphql";
import { MarkersContainer_settings } from "coral-admin/__generated__/MarkersContainer_settings.graphql";

import filterValidExternalModItems from "./externalModeration";
import Markers from "./Markers";
import ModerateCardDetailsContainer from "./ModerateCardDetailsContainer";

interface MarkersContainerProps {
  comment: MarkersContainer_comment;
  onUsernameClick: (id?: string) => void;
  settings: MarkersContainer_settings;
}

let keyCounter = 0;
const markers: Array<(
  c: MarkersContainer_comment
) => React.ReactElement<any> | null> = [
  (c) =>
    (c.status === "PREMOD" && (
      <Localized id="moderate-marker-preMod" key={keyCounter++}>
        <Marker color="pending">Pre-Mod</Marker>
      </Localized>
    )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_LINKS && (
        <Localized id="moderate-marker-link" key={keyCounter++}>
          <Marker color="pending">Link</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_BANNED_WORD &&
      c.revision.metadata?.wordList?.timedOut && (
        <Localized id="moderate-marker-possibleBannedWord" key={keyCounter++}>
          <Marker color="reported">Possible Banned Word</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_BANNED_WORD &&
      !c.revision.metadata?.wordList?.timedOut && (
        <Localized id="moderate-marker-bannedWord" key={keyCounter++}>
          <Marker color="reported">Banned Word</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_SUSPECT_WORD &&
      c.revision.metadata?.wordList?.timedOut && (
        <Localized id="moderate-marker-possibleSuspectWord" key={keyCounter++}>
          <Marker color="reported">Possible Suspect Word</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_SUSPECT_WORD &&
      !c.revision.metadata?.wordList?.timedOut && (
        <Localized id="moderate-marker-suspectWord" key={keyCounter++}>
          <Marker color="reported">Suspect Word</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_SPAM && (
        <Localized id="moderate-marker-spamDetected" key={keyCounter++}>
          <Marker color="reported">Spam Detected</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_TOXIC && (
        <Localized id="moderate-marker-toxic" key={keyCounter++}>
          <Marker color="reported">Toxic</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_REPEAT_POST && (
        <Localized id="moderate-marker-repeatPost" key={keyCounter++}>
          <Marker color="reported">Repeat comment</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_RECENT_HISTORY && (
        <Localized id="moderate-marker-recentHistory" key={keyCounter++}>
          <Marker color="reported">Recent History</Marker>
        </Localized>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE && (
        <Marker key={keyCounter++} color="reported">
          <Localized id="moderate-marker-offensive">
            <span>Offensive</span>
          </Localized>{" "}
          <MarkerCount>
            {c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE}
          </MarkerCount>
        </Marker>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_ABUSIVE && (
        <Marker key={keyCounter++} color="reported">
          <Localized id="moderate-marker-abusive">
            <span>Abusive</span>
          </Localized>{" "}
          <MarkerCount>
            {c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_ABUSIVE}
          </MarkerCount>
        </Marker>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM && (
        <Marker key={keyCounter++} color="reported">
          <Localized id="moderate-marker-spam">
            <span>Spam</span>
          </Localized>{" "}
          <MarkerCount>
            {c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM}
          </MarkerCount>
        </Marker>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_BIO && (
        <Marker key={keyCounter++} color="reported">
          <Localized id="moderate-marker-bio">
            <span>Bio</span>
          </Localized>{" "}
          <MarkerCount>
            {c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_BIO}
          </MarkerCount>
        </Marker>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OTHER && (
        <Marker key={keyCounter++} color="reported">
          <Localized id="moderate-marker-other">
            <span>Other</span>
          </Localized>{" "}
          <MarkerCount>
            {c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OTHER}
          </MarkerCount>
        </Marker>
      )) ||
    null,
  (c) =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_NEW_COMMENTER && (
        <Localized id="moderate-marker-newCommenter" key={keyCounter++}>
          <Marker color="reported">New commenter</Marker>
        </Localized>
      )) ||
    null,
];

export const MarkersContainer: React.FunctionComponent<MarkersContainerProps> = (
  props
) => {
  const elements = useMemo(
    () => markers.map((cb) => cb(props.comment)).filter((m) => m),
    [props.comment]
  );

  const phases = useMemo(() => {
    const validPhases: Array<React.ReactElement<
      any
    >> = filterValidExternalModItems(props.comment)
      .map((p) => <Marker key={p.name}>{p.name}</Marker>)
      .filter((p) => p);

    return validPhases;
  }, [props.comment]);

  return (
    <>
      <HorizontalGutter>
        <Flex spacing={2}>{phases}</Flex>
      </HorizontalGutter>
      <Markers
        details={
          <ModerateCardDetailsContainer
            onUsernameClick={props.onUsernameClick}
            comment={props.comment}
            settings={props.settings}
          />
        }
      >
        {elements}
      </Markers>
    </>
  );
};

const enhanced = withFragmentContainer<MarkersContainerProps>({
  comment: graphql`
    fragment MarkersContainer_comment on Comment {
      ...ModerateCardDetailsContainer_comment
      ...externalModeration_comment @relay(mask: false)
      status
      tags {
        code
      }
      revision {
        actionCounts {
          flag {
            reasons {
              COMMENT_REPORTED_SPAM
              COMMENT_REPORTED_OTHER
              COMMENT_REPORTED_OFFENSIVE
              COMMENT_REPORTED_ABUSIVE
              COMMENT_REPORTED_BIO
              COMMENT_DETECTED_TOXIC
              COMMENT_DETECTED_SUSPECT_WORD
              COMMENT_DETECTED_SPAM
              COMMENT_DETECTED_REPEAT_POST
              COMMENT_DETECTED_RECENT_HISTORY
              COMMENT_DETECTED_NEW_COMMENTER
              COMMENT_DETECTED_LINKS
              COMMENT_DETECTED_BANNED_WORD
            }
          }
        }
        metadata {
          wordList {
            timedOut
          }
          externalModeration {
            name
            analyzedAt
            result {
              status
              tags
              actions {
                reason
              }
            }
          }
        }
      }
    }
  `,
  settings: graphql`
    fragment MarkersContainer_settings on Settings {
      ...ModerateCardDetailsContainer_settings
    }
  `,
})(MarkersContainer);

export default enhanced;
