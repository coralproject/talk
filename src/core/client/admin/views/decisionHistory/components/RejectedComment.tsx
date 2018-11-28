import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import DecisionItem from "./DecisionItem";
import DotDivider from "./DotDivider";
import Footer from "./Footer";
import GoToCommentLink from "./GoToCommentLink";
import Info from "./Info";
import RejectedIcon from "./RejectedIcon";
import Timestamp from "./Timestamp";

import { Typography } from "talk-ui/components";

interface Props {
  username: string;
  date: string;
}

const Username: StatelessComponent<{ username: string }> = ({ username }) => (
  <strong>{username}</strong>
);

const RejectedComment: StatelessComponent<Props> = props => (
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
      <GoToCommentLink />
    </Footer>
  </DecisionItem>
);

export default RejectedComment;
