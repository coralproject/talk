import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";

import ConfigureLinks from "./ConfigureLinks";
import Layout from "./Layout";
import Main from "./Main";
import SideBar from "./SideBar";

interface Props {
  children: React.ReactElement;
}

const InnerFormLayout: FunctionComponent<Props> = (props) => {
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

export default InnerFormLayout;
