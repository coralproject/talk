import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";

import DecisionHistoryItemContainer from "./DecisionHistoryItemContainer";
import DecisionList from "./DecisionList";
import Empty from "./Empty";
import Main from "./Main";
import ShowMoreButton from "./ShowMoreButton";
import Title from "./Title";

interface Props {
  actions: Array<
    { id: string } & PropTypesOf<typeof DecisionHistoryItemContainer>["action"]
  >;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
  onClosePopover: () => void;
}

const DecisionHistory: FunctionComponent<Props> = (props) => (
  <div data-testid="decisionHistory-container">
    <Title />
    <Main>
      <DecisionList>
        {props.actions.length === 0 && <Empty />}
        {props.actions.map((action) => (
          <DecisionHistoryItemContainer
            key={action.id}
            action={action}
            onClosePopover={props.onClosePopover}
          />
        ))}
      </DecisionList>
      {props.hasMore && (
        <ShowMoreButton
          onClick={props.onLoadMore}
          disabled={props.disableLoadMore}
        />
      )}
    </Main>
  </div>
);

export default DecisionHistory;
