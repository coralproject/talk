import React from "react";

import { oncePerFrame } from "talk-common/utils";
import { ClickOutside, Popover } from "talk-ui/components";

import ReportCommentView from "../../views/reportComment";
import ReportButton from "./ReportButton";

import { PropTypesOf } from "talk-ui/types";

interface Props {
  comment: { id: string } & PropTypesOf<typeof ReportCommentView>["comment"];
  reported: boolean;
}

class ReportButtonWithPopover extends React.Component<Props> {
  // Helper that prevents calling toggleVisibility more then once per frame.
  // In essence this means we'll process an event only once.
  // This might happen, when clicking on the button which will
  // cause its onClick to happen as well as onClickOutside.
  private toggleVisibilityOncePerFrame = oncePerFrame(
    (toggleVisibility: () => void) => toggleVisibility()
  );

  public render() {
    const { comment, reported } = this.props;
    const popoverID = `report-popover-${comment.id}`;
    return (
      <Popover
        id={popoverID}
        placement="top-end"
        description="A dialog for reporting comments"
        body={({ toggleVisibility, scheduleUpdate }) => (
          <ClickOutside
            onClickOutside={() =>
              this.toggleVisibilityOncePerFrame(toggleVisibility)
            }
          >
            <ReportCommentView
              comment={comment}
              onClose={() =>
                this.toggleVisibilityOncePerFrame(toggleVisibility)
              }
              onResize={scheduleUpdate}
            />
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, forwardRef, visible }) => (
          <ReportButton
            onClick={() =>
              !reported && this.toggleVisibilityOncePerFrame(toggleVisibility)
            }
            aria-controls={popoverID}
            ref={forwardRef}
            active={visible}
            reported={reported}
          />
        )}
      </Popover>
    );
  }
}

export default ReportButtonWithPopover;
