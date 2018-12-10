import React from "react";
import { graphql } from "react-relay";

import { MarkersContainer_comment as CommentData } from "talk-admin/__generated__/MarkersContainer_comment.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { Marker, MarkerCount } from "talk-ui/components";

interface MarkersContainerProps {
  comment: CommentData;
}

let keyCounter = 0;
const markers: Array<(c: CommentData) => React.ReactElement<any> | null> = [
  c =>
    (c.status === "PREMOD" && (
      <Marker key={keyCounter++} color="primary">
        Pre-Mod
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_LINKS && (
      <Marker key={keyCounter++} color="primary">
        Link
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_BANNED_WORD && (
      <Marker key={keyCounter++} color="error">
        Banned Word
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_SUSPECT_WORD && (
      <Marker key={keyCounter++} color="error" variant="filled">
        Suspect Word
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_SPAM && (
      <Marker key={keyCounter++} color="error">
        Spam
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_TOXIC && (
      <Marker key={keyCounter++} color="error">
        Toxic
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_TRUST && (
      <Marker key={keyCounter++} color="error">
        Karma
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_DETECTED_BODY_COUNT && (
      <Marker key={keyCounter++} color="error">
        Body Count
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE && (
      <Marker key={keyCounter++} color="error">
        Offensive{" "}
        <MarkerCount>
          {c.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE}
        </MarkerCount>
      </Marker>
    )) ||
    null,
  c =>
    (c.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM && (
      <Marker key={keyCounter++} color="error">
        Spam{" "}
        <MarkerCount>
          {c.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM}
        </MarkerCount>
      </Marker>
    )) ||
    null,
];

class MarkersContainer extends React.Component<MarkersContainerProps> {
  public render() {
    return markers.map(cb => cb(this.props.comment));
  }
}

const enhanced = withFragmentContainer<MarkersContainerProps>({
  comment: graphql`
    fragment MarkersContainer_comment on Comment {
      status
      actionCounts {
        flag {
          reasons {
            COMMENT_DETECTED_TOXIC
            COMMENT_DETECTED_SPAM
            COMMENT_DETECTED_BODY_COUNT
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
