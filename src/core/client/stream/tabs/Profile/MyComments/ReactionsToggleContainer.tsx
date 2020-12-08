import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";

import { ReactionsToggleContainer_comment } from "coral-stream/__generated__/ReactionsToggleContainer_comment.graphql";
import { ReactionsToggleContainer_settings } from "coral-stream/__generated__/ReactionsToggleContainer_settings.graphql";

import styles from "./ReactionsToggleContainer.css";

interface Props {
  comment: ReactionsToggleContainer_comment;
  settings: ReactionsToggleContainer_settings;
}

const ReactionsToggleContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
  if (!comment.actionCounts.reaction.total) {
    return null;
  }
  return (
    <>
      <div className={cn(styles.reactions, CLASSES.myComment.reactions)}>
        <Icon className={styles.icon}>{settings.reaction.icon}</Icon>
        <span>
          {settings.reaction.label} {comment.actionCounts.reaction.total}
        </span>
      </div>
      {comment.reactions.nodes.map((n) => (
        <div key={n.id}>{n.reacter?.username}</div>
      ))}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ReactionsToggleContainer_comment on Comment {
      reactions {
        nodes {
          reaction {
            id
            reacter {
              username
            }
          }
        }
      }
      actionCounts {
        reaction {
          total
        }
      }
    }
  `,
  settings: graphql`
    fragment ReactionsToggleContainer_settings on Settings {
      reaction {
        label
        icon
      }
    }
  `,
})(ReactionsToggleContainer);

export default enhanced;
