import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";

import ConfigureLinks from "../../ConfigureLinks";
import Main from "../../Main";
import SideBar from "../../SideBar";
import Layout from "./Layout";

interface Props {
  children: React.ReactElement;
}

const SitesRoute: FunctionComponent<Props> = props => {
  return (
    <MainLayout>
      <Layout>
        <SideBar>
          <ConfigureLinks />
        </SideBar>
        <Main>{props.children}</Main>
      </Layout>
    </MainLayout>
  );
};

export default SitesRoute;
