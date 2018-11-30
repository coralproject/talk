import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import AcceptedIcon from "./AcceptedIcon";
import DecisionItem from "./DecisionItem";
import DotDivider from "./DotDivider";
import Footer from "./Footer";
import GoToCommentLink from "./GoToCommentLink";
import Info from "./Info";
import Timestamp from "./Timestamp";

import { Typography } from "talk-ui/components";

interface Props {
  href: string;
  username: string;
  date: string;
  onGotoComment?: React.EventHandler<React.MouseEvent>;
}

const Username: StatelessComponent<{ username: string }> = ({ username }) => (
  <strong>{username}</strong>
);

const ApprovedComment: StatelessComponent<Props> = props => (
  <DecisionItem icon={<AcceptedIcon />}>
    <Localized
      id="decisionHistory-acceptedCommentBy"
      username={<Username username={props.username} />}
    >
      <Info>{"Accepted comment by <username></username>"}</Info>
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

export default ApprovedComment;
