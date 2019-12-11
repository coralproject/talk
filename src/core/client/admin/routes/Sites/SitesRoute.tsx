import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";

import ConfigureLinks from "../Configure/ConfigureLinks";
import Main from "../Configure/Main";
import SideBar from "../Configure/SideBar";
import Layout from "./Layout";

interface Props {
  children: React.ReactElement;
}

const SitesRoute: FunctionComponent<Props> = props => {
  return (
    <MainLayout data-testid="configure-container">
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
