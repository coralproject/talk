import { FunctionComponent, ReactElement, useCallback, useState } from "react";

interface InjectedCollapsableCommentProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

interface Props {
  children(props: InjectedCollapsableCommentProps): ReactElement;
  defaultCollapsed?: boolean;
  comment?: {
    lastViewerAction?: string | null;
  };
}

const CollapsableComment: FunctionComponent<Props> = ({
  children,
  defaultCollapsed = false,
  comment,
}) => {
  // If comment was just created, always start un-collapsed
  const isNewlyCreated = comment?.lastViewerAction === "CREATE";
  const initialCollapsed = isNewlyCreated ? false : defaultCollapsed;
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);
  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  return children({ collapsed, toggleCollapsed });
};

export default CollapsableComment;
