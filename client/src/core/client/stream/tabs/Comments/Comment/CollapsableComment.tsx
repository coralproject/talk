import { FunctionComponent, ReactElement, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";

import { CollapsableCommentLocal } from "coral-stream/__generated__/CollapsableCommentLocal.graphql";

interface InjectedCollapsableCommentProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

interface Props {
  children(props: InjectedCollapsableCommentProps): ReactElement;
  defaultCollapsed?: boolean;
  commentID: string;
  comment?: {
    lastViewerAction?: string | null;
  };
}

const CollapsableComment: FunctionComponent<Props> = ({
  children,
  defaultCollapsed = false,
  commentID,
  comment,
}) => {
  const [{ collapsedCommentSettings }, setLocal] =
    useLocal<CollapsableCommentLocal>(graphql`
      fragment CollapsableCommentLocal on Local {
        collapsedCommentSettings {
          commentIDs
        }
      }
    `);

  // If comment was just created, always start un-collapsed
  const isNewlyCreated = comment?.lastViewerAction === "CREATE";

  const collapsed = useMemo(() => {
    // If comment was just created, always show un-collapsed
    if (isNewlyCreated) {
      return false;
    }

    const commentInSettings =
      collapsedCommentSettings?.commentIDs.includes(commentID) ?? false;
    // If in settings list, it means it's toggled to opposite of default
    return defaultCollapsed ? !commentInSettings : commentInSettings;
  }, [collapsedCommentSettings, commentID, defaultCollapsed, isNewlyCreated]);

  const toggleCollapsed = useCallback(() => {
    const initialSettings = collapsedCommentSettings ?? { commentIDs: [] };
    const indexOfComment = initialSettings.commentIDs.indexOf(commentID);

    if (indexOfComment === -1) {
      // Add to list - comment is now opposite of default
      setLocal({
        collapsedCommentSettings: {
          commentIDs: initialSettings.commentIDs.concat(commentID),
        },
      });
    } else {
      // Remove from list - comment returns to default
      setLocal({
        collapsedCommentSettings: {
          commentIDs: initialSettings.commentIDs.filter(
            (id: string) => id !== commentID
          ),
        },
      });
    }
  }, [commentID, collapsedCommentSettings, setLocal]);

  return children({ collapsed, toggleCollapsed });
};

export default CollapsableComment;
