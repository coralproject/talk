import { FunctionComponent, ReactElement, useCallback, useState } from "react";

interface InjectedCollapsableCommentProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

interface Props {
  children(props: InjectedCollapsableCommentProps): ReactElement;
  defaultCollapsed?: boolean;
}

const CollapsableComment: FunctionComponent<Props> = ({
  children,
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  return children({ collapsed, toggleCollapsed });
};

export default CollapsableComment;
