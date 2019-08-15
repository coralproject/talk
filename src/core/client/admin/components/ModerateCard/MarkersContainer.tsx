import { Localized } from "fluent-react/compat";
import React from "react";
import { graphql } from "react-relay";

import { MarkersContainer_comment } from "coral-admin/__generated__/MarkersContainer_comment.graphql";
import { MarkersContainer_settings } from "coral-admin/__generated__/MarkersContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { Marker, MarkerCount } from "coral-ui/components";
import FlagDetailsContainer from "./FlagDetailsContainer";
import Markers from "./Markers";

interface MarkersContainerProps {
  comment: MarkersContainer_comment;
  onUsernameClick: (id?: string) => void;
  settings: MarkersContainer_settings;
}

function hasDetails(c: MarkersContainer_comment) {
  return (
    c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE +
      c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM >
      0 || c.revision.metadata.perspective
  );
}

let keyCounter = 0;
const markers: Array<
  (c: MarkersContainer_comment) => React.ReactElement<any> | null
> = [
  c =>
    (c.status === "PREMOD" && (
      <Localized id="moderate-marker-preMod" key={keyCounter++}>
        <Marker color="primary">Pre-Mod</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_LINKS && (
      <Localized id="moderate-marker-link" key={keyCounter++}>
        <Marker color="primary">Link</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_BANNED_WORD && (
      <Localized id="moderate-marker-bannedWord" key={keyCounter++}>
        <Marker color="error">Banned Word</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_SUSPECT_WORD && (
      <Localized id="moderate-marker-suspectWord" key={keyCounter++}>
        <Marker color="error" variant="filled">
          Suspect Word
        </Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_SPAM && (
      <Localized id="moderate-marker-spam" key={keyCounter++}>
        <Marker color="error">Spam</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_TOXIC && (
      <Localized id="moderate-marker-toxic" key={keyCounter++}>
        <Marker color="error">Toxic</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision.actionCounts.flag.reasons.COMMENT_DETECTED_RECENT_HISTORY && (
      <Localized id="moderate-marker-recentHistory" key={keyCounter++}>
        <Marker color="error">Recent History</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE && (
      <Marker key={keyCounter++} color="error">
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
    (c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM && (
      <Marker key={keyCounter++} color="error">
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
          doesHaveDetails ? (
            <FlagDetailsContainer
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
      ...FlagDetailsContainer_comment
      status
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
      ...FlagDetailsContainer_settings
    }
  `,
})(MarkersContainer);

export default enhanced;
