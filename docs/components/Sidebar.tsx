import React, { FunctionComponent } from "react";
import SidebarNav from "./SidebarNav";

interface Props {
  pagePath: string;
}

const Sidebar: FunctionComponent<Props> = ({ pagePath }) => {
  return (
    <aside className="flex-none w-80">
      <SidebarNav currentPagePath={pagePath} />
    </aside>
  );
};

export default Sidebar;
