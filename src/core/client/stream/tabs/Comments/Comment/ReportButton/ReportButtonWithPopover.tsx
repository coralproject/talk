import { Localized } from "@fluent/react/compat";
import React from "react";

import { ClickOutside, Popover } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import ReportPopover from "../ReportPopover";
import ReportButton from "./ReportButton";

interface Props {
  comment: { id: string } & PropTypesOf<typeof ReportPopover>["comment"];
  reported: boolean;
  className?: string;
}

const ReportButtonWithPopover: React.FunctionComponent<Props> = ({
  comment,
  reported,
  className,
}) => {
  const popoverID = `report-popover-${comment.id}`;
  return (
    <Localized id="comments-reportPopover" attrs={{ description: true }}>
      <Popover
        id={popoverID}
        placement="top-end"
        description="A dialog for reporting comments"
        modifiers={{
          flip: {
            enabled: false,
          },
        }}
        body={({ toggleVisibility, scheduleUpdate }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <ReportPopover
              comment={comment}
              onClose={toggleVisibility}
              onResize={scheduleUpdate}
            />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref, visible }) => (
          <ReportButton
            className={className}
            onClick={(evt) => !reported && toggleVisibility(evt)}
            aria-controls={popoverID}
            ref={ref}
            active={visible}
            reported={reported}
          />
        )}
      </Popover>
    </Localized>
  );
};

export default ReportButtonWithPopover;
