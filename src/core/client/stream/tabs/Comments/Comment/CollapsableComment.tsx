import { FunctionComponent, ReactElement, useCallback, useState } from "react";

interface InjectedCollapsableCommentProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

interface Props {
  children(props: InjectedCollapsableCommentProps): ReactElement;
}

const CollapsableComment: FunctionComponent<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  return children({ collapsed, toggleCollapsed });
};

export default CollapsableComment;
