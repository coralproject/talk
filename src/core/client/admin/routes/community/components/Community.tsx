import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import { PropTypesOf } from "talk-framework/types";

import UserTableContainer from "../containers/UserTableContainer";

import styles from "./Community.css";

interface Props {
  query: PropTypesOf<typeof UserTableContainer>["query"];
}

const Community: StatelessComponent<Props> = props => (
  <MainLayout className={styles.root}>
    <UserTableContainer query={props.query} />
  </MainLayout>
);

export default Community;
