import { Localized } from "fluent-react/compat";
import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Marker, MarkerCount } from "coral-ui/components/v2";

import { MarkersContainer_comment } from "coral-admin/__generated__/MarkersContainer_comment.graphql";
import { MarkersContainer_settings } from "coral-admin/__generated__/MarkersContainer_settings.graphql";

import Markers from "./Markers";
import ModerateCardDetailsContainer from "./ModerateCardDetailsContainer";

interface MarkersContainerProps {
  comment: MarkersContainer_comment;
  onUsernameClick: (id?: string) => void;
  settings: MarkersContainer_settings;
}

function hasDetails(c: MarkersContainer_comment) {
  return c.revision
    ? c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM >
        0 || c.revision.metadata.perspective
    : false;
}

let keyCounter = 0;
const markers: Array<
  (c: MarkersContainer_comment) => React.ReactElement<any> | null
> = [
  c =>
    (c.status === "PREMOD" && (
      <Localized id="moderate-marker-preMod" key={keyCounter++}>
        <Marker color="pending">Pre-Mod</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_LINKS && (
        <Localized id="moderate-marker-link" key={keyCounter++}>
          <Marker color="pending">Link</Marker>
        </Localized>
      )) ||
    null,
  c =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_BANNED_WORD && (
        <Localized id="moderate-marker-bannedWord" key={keyCounter++}>
          <Marker color="reported">Banned Word</Marker>
        </Localized>
      )) ||
    null,
  c =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_SUSPECT_WORD && (
        <Localized id="moderate-marker-suspectWord" key={keyCounter++}>
          <Marker color="reported" variant="filled">
            Suspect Word
          </Marker>
        </Localized>
      )) ||
    null,
  c =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_SPAM && (
        <Localized id="moderate-marker-spamDetected" key={keyCounter++}>
          <Marker color="reported">Spam Detected</Marker>
        </Localized>
      )) ||
    null,
  c =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_TOXIC && (
        <Localized id="moderate-marker-toxic" key={keyCounter++}>
          <Marker color="reported">Toxic</Marker>
        </Localized>
      )) ||
    null,
  c =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_REPEAT_POST && (
        <Localized id="moderate-marker-repeatPost" key={keyCounter++}>
          <Marker color="reported">Repeat comment</Marker>
        </Localized>
      )) ||
    null,
  c =>
    (c.revision &&
      c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_RECENT_HISTORY && (
        <Localized id="moderate-marker-recentHistory" key={keyCounter++}>
          <Marker color="reported">Recent History</Marker>
        </Localized>
      )) ||
    null,
  c =>
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
  c =>
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
];

export class MarkersContainer extends React.Component<MarkersContainerProps> {
  public render() {
    const elements = markers.map(cb => cb(this.props.comment)).filter(m => m);
    const doesHaveDetails = hasDetails(this.props.comment);
    if (elements.length === 0 && !doesHaveDetails) {
      return null;
    }

    return (
      <Markers
        details={
          doesHaveDetails || this.props.comment.editing.edited ? (
            <ModerateCardDetailsContainer
              hasDetails={!!doesHaveDetails}
              hasRevisions={this.props.comment.editing.edited}
              onUsernameClick={this.props.onUsernameClick}
              comment={this.props.comment}
              settings={this.props.settings}
            />
          ) : null
        }
      >
        {elements}
      </Markers>
    );
  }
}

const enhanced = withFragmentContainer<MarkersContainerProps>({
  comment: graphql`
    fragment MarkersContainer_comment on Comment {
      ...ModerateCardDetailsContainer_comment
      status
      editing {
        edited
      }
      revision {
        actionCounts {
          flag {
            reasons {
              COMMENT_DETECTED_TOXIC
              COMMENT_DETECTED_SPAM
              COMMENT_DETECTED_RECENT_HISTORY
              COMMENT_DETECTED_LINKS
              COMMENT_DETECTED_BANNED_WORD
              COMMENT_DETECTED_SUSPECT_WORD
              COMMENT_REPORTED_OFFENSIVE
              COMMENT_REPORTED_SPAM
              COMMENT_DETECTED_REPEAT_POST
            }
          }
        }
        metadata {
          perspective {
            score
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
