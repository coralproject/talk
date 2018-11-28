import React, { StatelessComponent } from "react";

import ApprovedComment from "./ApprovedComment";
import DecisionList from "./DecisionList";
import Main from "./Main";
import RejectedComment from "./RejectedComment";
import ShowMoreButton from "./ShowMoreButton";
import Title from "./Title";

const DecisionHistory: StatelessComponent = () => (
  <div>
    <Title />
    <Main>
      <DecisionList>
        <ApprovedComment
          username="twelvedognight"
          date={new Date().toISOString()}
        />
        <RejectedComment
          username="twelvedognight"
          date={new Date().toISOString()}
        />
      </DecisionList>
      <ShowMoreButton />
    </Main>
  </div>
);

export default DecisionHistory;
