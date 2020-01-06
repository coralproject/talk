import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { ShowFeaturedCommentTooltipEvent } from "coral-stream/events";
import { Tooltip, TooltipButton } from "coral-ui/components";

interface Props {
  className?: string;
  active?: boolean;
}

const FeaturedCommentTooltipContent: FunctionComponent = props => {
  const emitShowTooltipEvent = useViewerEvent(ShowFeaturedCommentTooltipEvent);
  useEffect(() => {
    emitShowTooltipEvent();
  }, []);
  return (
    <Localized id="comments-featuredCommentTooltip-handSelectedComments">
      <span>Comments are hand selected by our team as worth reading.</span>
    </Localized>
  );
};

export const FeaturedCommentTooltip: FunctionComponent<Props> = props => {
  return (
    <Tooltip
      id="comments-featuredCommentPopover"
      className={props.className}
      title={
        <Localized id="comments-featuredCommentTooltip-how">
          <span>How is a comment featured?</span>
        </Localized>
      }
      body={<FeaturedCommentTooltipContent />}
      button={({ toggleVisibility, ref, visible }) => (
        <Localized
          id="comments-featuredCommentTooltip-toggleButton"
          attrs={{ "aria-label": true }}
        >
          <TooltipButton
            active={props.active}
            aria-label="Toggle featured comments tooltip"
            toggleVisibility={toggleVisibility}
            ref={ref}
          />
        </Localized>
      )}
    />
  );
};

export default FeaturedCommentTooltip;
