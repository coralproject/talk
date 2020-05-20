import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useState,
} from "react";

// import {} from "coral-ui/components/v2";

// import styles from "./CollapsableComment.css";

interface InjectedCollapsableCommentProps {
  collapsed: boolean;
}

interface Props {
  children(props: InjectedCollapsableCommentProps): ReactElement;
}

const CollapsableComment: FunctionComponent<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  return (
    <div>
      <button onClick={toggleCollapsed}>{collapsed ? "+" : "-"}</button>
      {/* {!collapsed && children} */}
      {children({ collapsed })}
    </div>
  );
};

export default CollapsableComment;
