import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import ApprovedIcon from "./ApprovedIcon";
import DecisionItem from "./DecisionItem";
import DotDivider from "./DotDivider";
import Footer from "./Footer";
import GoToCommentLink from "./GoToCommentLink";
import Info from "./Info";
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

const ApprovedComment: FunctionComponent<Props> = props => (
  <DecisionItem icon={<ApprovedIcon />}>
    <Localized
      id="decisionHistory-approvedCommentBy"
      Username={<Username username={props.username} />}
    >
      <Info>{"Approved comment by <Username></Username>"}</Info>
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
