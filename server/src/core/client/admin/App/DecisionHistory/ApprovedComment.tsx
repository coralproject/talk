import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import ApprovedIcon from "./ApprovedIcon";
import DecisionItem from "./DecisionItem";
import DotDivider from "./DotDivider";
import Footer from "./Footer";
import GoToCommentLink from "./GoToCommentLink";
import Info from "./Info";
import Timestamp from "./Timestamp";
import Username from "./Username";

interface Props {
  href: string | null;
  username: string;
  date: string;
  onGotoComment?: React.EventHandler<React.MouseEvent>;
}

const ApprovedComment: FunctionComponent<Props> = (props) => (
  <DecisionItem icon={<ApprovedIcon />}>
    <Localized
      id="decisionHistory-approvedCommentBy"
      elems={{ Username: <Username username={props.username} /> }}
    >
      <Info>{"Approved comment by <Username></Username>"}</Info>
    </Localized>
    <Footer>
      <Timestamp>{props.date}</Timestamp>
      {props.href && (
        <>
          <DotDivider />
          <GoToCommentLink href={props.href} onClick={props.onGotoComment} />
        </>
      )}
    </Footer>
  </DecisionItem>
);

export default ApprovedComment;
