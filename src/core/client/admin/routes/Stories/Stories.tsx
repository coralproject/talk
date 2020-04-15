import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { PropTypesOf } from "coral-framework/types";

import StoryTableContainer from "./StoryTableContainer";

import styles from "./Stories.css";

interface Props {
  query: PropTypesOf<typeof StoryTableContainer>["query"];
  initialSearchFilter?: string;
}

const Stories: FunctionComponent<Props> = (props) => (
  <MainLayout className={styles.root} data-testid="stories-container">
    <StoryTableContainer
      query={props.query}
      initialSearchFilter={props.initialSearchFilter}
    />
  </MainLayout>
);

export default Stories;
