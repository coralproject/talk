import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { PropTypesOf } from "coral-framework/types";

import UserTableContainer from "./UserTableContainer";

import styles from "./Community.css";

interface Props {
  query: PropTypesOf<typeof UserTableContainer>["query"];
}

const Community: FunctionComponent<Props> = (props) => (
  <MainLayout className={styles.root} data-testid="community-container">
    <UserTableContainer query={props.query} />
  </MainLayout>
);

export default Community;
