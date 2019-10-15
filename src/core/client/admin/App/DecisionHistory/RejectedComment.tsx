import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components";

import DecisionItem from "./DecisionItem";
import DotDivider from "./DotDivider";
import Footer from "./Footer";
import GoToCommentLink from "./GoToCommentLink";
import Info from "./Info";
import RejectedIcon from "./RejectedIcon";
import Timestamp from "./Timestamp";

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
      Username={<Username username={props.username} />}
    >
      <Info>{"Rejected comment by <Username></Username>"}</Info>
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
