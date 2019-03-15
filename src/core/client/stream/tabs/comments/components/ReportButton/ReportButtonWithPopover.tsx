import React from "react";

import { ClickOutside, Popover } from "talk-ui/components";

import ReportCommentView from "../../views/reportComment";
import ReportButton from "./ReportButton";

import { PropTypesOf } from "talk-ui/types";

interface Props {
  comment: { id: string } & PropTypesOf<typeof ReportCommentView>["comment"];
  reported: boolean;
}

const ReportButtonWithPopover: React.StatelessComponent<Props> = ({
  comment,
  reported,
}) => {
  const popoverID = `report-popover-${comment.id}`;
  return (
    <Popover
      id={popoverID}
      placement="top-end"
      description="A dialog for reporting comments"
      body={({ toggleVisibility, scheduleUpdate }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <ReportCommentView
            comment={comment}
            onClose={toggleVisibility}
            onResize={scheduleUpdate}
          />
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <ReportButton
          onClick={evt => !reported && toggleVisibility(evt)}
          aria-controls={popoverID}
          ref={ref}
          active={visible}
          reported={reported}
        />
      )}
    </Popover>
  );
};

export default ReportButtonWithPopover;
