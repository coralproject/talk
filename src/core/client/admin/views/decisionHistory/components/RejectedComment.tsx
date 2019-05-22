import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import DecisionItem from "./DecisionItem";
import DotDivider from "./DotDivider";
import Footer from "./Footer";
import GoToCommentLink from "./GoToCommentLink";
import Info from "./Info";
import RejectedIcon from "./RejectedIcon";
import Timestamp from "./Timestamp";

import { Typography } from "coral-ui/components";

interface Props {
  href: string;
  username: string;
  date: string;
  onGotoComment?: React.EventHandler<React.MouseEvent>;
}

const Username: FunctionComponent<{ username: string }> = ({ username }) => (
  <strong>{username}</strong>
);

const RejectedComment: FunctionComponent<Props> = props => (
  <DecisionItem icon={<RejectedIcon />}>
    <Localized
      id="decisionHistory-rejectedCommentBy"
      username={<Username username={props.username} />}
    >
      <Info>{"Rejected comment by <username></username>"}</Info>
    </Localized>
    <Footer>
      <Typography variant="timestamp">
        <Timestamp>{props.date}</Timestamp>
      </Typography>
      <DotDivider />
      <GoToCommentLink href={props.href} onClick={props.onGotoComment} />
    </Footer>
  </DecisionItem>
);

export default RejectedComment;
