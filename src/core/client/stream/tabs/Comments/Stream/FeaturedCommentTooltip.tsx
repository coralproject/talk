import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Tooltip, TooltipButton } from "coral-ui/components";

interface Props {
  className?: string;
  active?: boolean;
}

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
      body={
        <Localized id="comments-featuredCommentTooltip-handSelectedComments">
          <span>Comments are hand selected by our team as worth reading.</span>
        </Localized>
      }
      button={({ toggleVisibility, ref }) => (
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
