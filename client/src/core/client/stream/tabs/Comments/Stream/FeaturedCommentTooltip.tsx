import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { ShowFeaturedCommentTooltipEvent } from "coral-stream/events";
import { Tooltip, TooltipButton } from "coral-ui/components/v2";

import styles from "./FeaturedCommentTooltip.css";

interface TooltipProps {
  className?: string;
  active?: boolean;
  isQA?: boolean;
}

interface ContentProps {
  isQA?: boolean;
}

const FeaturedCommentTooltipContent: FunctionComponent<ContentProps> = (
  props
) => {
  const emitShowTooltipEvent = useViewerEvent(ShowFeaturedCommentTooltipEvent);
  useEffect(() => {
    emitShowTooltipEvent();
  }, []);

  if (props.isQA) {
    return (
      <Localized id="qa-answeredTooltip-answeredComments">
        <span>Questions are answered by a Q&A expert.</span>
      </Localized>
    );
  }

  return (
    <Localized id="comments-featuredCommentTooltip-handSelectedComments">
      <span>Comments are hand selected by our team as worth reading.</span>
    </Localized>
  );
};

export const FeaturedCommentTooltip: FunctionComponent<TooltipProps> = (
  props
) => {
  if (props.isQA) {
    return (
      <Tooltip
        id="qa-AnsweredPopover"
        className={props.className}
        title={
          <Localized id="qa-answeredTooltip-how">
            <span>How is a question answered?</span>
          </Localized>
        }
        body={<FeaturedCommentTooltipContent isQA={props.isQA} />}
        button={({ toggleVisibility, ref, visible }) => (
          <Localized
            id="qa-answeredTooltip-toggleButton"
            attrs={{ "aria-label": true, title: true }}
          >
            <TooltipButton
              classes={{
                button: styles.button,
              }}
              active={props.active}
              activeColor="primary"
              ariaLabel="Toggle featured comments tooltip"
              aria-label="Toggle answered questions tooltip"
              title="Toggle answered questions tooltip"
              toggleVisibility={toggleVisibility}
              ref={ref}
            />
          </Localized>
        )}
      />
    );
  }

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
          attrs={{ "aria-label": true, title: true }}
        >
          <TooltipButton
            classes={{
              button: styles.button,
            }}
            active={props.active}
            activeColor="primary"
            ariaLabel="Toggle featured comments tooltip"
            aria-label="Toggle featured comments tooltip"
            title="Toggle featured comments tooltip"
            toggleVisibility={toggleVisibility}
            ref={ref}
          />
        </Localized>
      )}
    />
  );
};

export default FeaturedCommentTooltip;
