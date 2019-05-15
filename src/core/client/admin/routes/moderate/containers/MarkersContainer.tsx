import { Localized } from "fluent-react/compat";
import React from "react";
import { graphql } from "react-relay";

import { MarkersContainer_comment as CommentData } from "talk-admin/__generated__/MarkersContainer_comment.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { Marker, MarkerCount } from "talk-ui/components";
import Markers from "../components/Markers";
import FlagDetailsContainer from "./FlagDetailsContainer";

interface MarkersContainerProps {
  comment: CommentData;
}

function hasDetails(c: CommentData) {
  return (
    c.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE +
      c.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM >
    0
  );
}

let keyCounter = 0;
const markers: Array<(c: CommentData) => React.ReactElement<any> | null> = [
  c =>
    (c.status === "PREMOD" && (
      <Localized id="moderate-marker-preMod" key={keyCounter++}>
        <Marker color="primary">Pre-Mod</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_LINKS && (
      <Localized id="moderate-marker-link" key={keyCounter++}>
        <Marker color="primary">Link</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_BANNED_WORD && (
      <Localized id="moderate-marker-bannedWord" key={keyCounter++}>
        <Marker color="error">Banned Word</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_SUSPECT_WORD && (
      <Localized id="moderate-marker-suspectWord" key={keyCounter++}>
        <Marker color="error" variant="filled">
          Suspect Word
        </Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_SPAM && (
      <Localized id="moderate-marker-spam" key={keyCounter++}>
        <Marker color="error">Spam</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_TOXIC && (
      <Localized id="moderate-marker-toxic" key={keyCounter++}>
        <Marker color="error">Toxic</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_TRUST && (
      <Localized id="moderate-marker-karma" key={keyCounter++}>
        <Marker color="error">Karma</Marker>
      </Localized>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE && (
      <Marker key={keyCounter++} color="error">
        <Localized id="moderate-marker-offensive">
          <span>Offensive</span>
        </Localized>{" "}
        <MarkerCount>
          {c.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE}
        </MarkerCount>
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM && (
      <Marker key={keyCounter++} color="error">
        <Localized id="moderate-marker-spam">
          <span>Spam</span>
        </Localized>{" "}
        <MarkerCount>
          {c.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM}
        </MarkerCount>
      </Marker>
    )) ||
    null,
];

export class MarkersContainer extends React.Component<MarkersContainerProps> {
  public render() {
    const elements = markers.map(cb => cb(this.props.comment)).filter(m => m);
    if (elements.length) {
      return (
        <Markers
          details={
            hasDetails(this.props.comment) ? (
              <FlagDetailsContainer comment={this.props.comment} />
            ) : null
          }
        >
          {elements}
        </Markers>
      );
    }
    return null;
  }
}

const enhanced = withFragmentContainer<MarkersContainerProps>({
  comment: graphql`
    fragment MarkersContainer_comment on Comment {
      ...FlagDetailsContainer_comment
      status
      actionCounts {
        flag {
          reasons {
            COMMENT_DETECTED_TOXIC
            COMMENT_DETECTED_SPAM
            COMMENT_DETECTED_TRUST
            COMMENT_DETECTED_LINKS
            COMMENT_DETECTED_BANNED_WORD
            COMMENT_DETECTED_SUSPECT_WORD
            COMMENT_REPORTED_OFFENSIVE
            COMMENT_REPORTED_SPAM
          }
        }
      }
    }
  `,
})(MarkersContainer);

export default enhanced;
