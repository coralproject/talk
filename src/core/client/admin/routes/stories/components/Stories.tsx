import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import { PropTypesOf } from "talk-framework/types";

import StoryTableContainer from "../containers/StoryTableContainer";

import styles from "./Stories.css";

interface Props {
  query: PropTypesOf<typeof StoryTableContainer>["query"];
}

const Stories: StatelessComponent<Props> = props => (
  <MainLayout className={styles.root} data-testid="stories-container">
    <StoryTableContainer query={props.query} />
  </MainLayout>
);

export default Stories;
