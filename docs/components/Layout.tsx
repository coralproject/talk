import { FunctionComponent } from "react";
import MainNav from "./MainNav";
import Sidebar from "./Sidebar";

interface Props {
  pagePath: string;
}

const Layout: FunctionComponent<Props> = ({ children, pagePath }) => {
  return (
    <main className="text-gray-500">
      <MainNav />
      <div className="flex">
        <Sidebar pagePath={pagePath} />
        <div className="flex-auto flex flex-col">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
