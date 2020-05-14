import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useState, useCallback } from "react";

import {} from "coral-ui/components/v2";

import styles from "./CollapsableComment.css";

interface Props {}

const CollapsableComment: FunctionComponent<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  return (
    <div>
      <button onClick={toggleCollapsed}>{collapsed ? "+" : "-"}</button>
      {!collapsed && children}
    </div>
  );
};

export default CollapsableComment;
