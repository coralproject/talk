import React, { FunctionComponent, ReactNode } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import ModerateCardContainer from "coral-admin/components/ModerateCard";
import { PropTypesOf } from "coral-ui/types";

import styles from "./QueueWrapper.css";

interface Props {
  singleView: boolean;
  comments: Array<
    { id: string } & PropTypesOf<typeof ModerateCardContainer>["comment"]
  >;
  card: (
    c: { id: string } & PropTypesOf<typeof ModerateCardContainer>["comment"],
    i: number
  ) => ReactNode;
  selected: number | null;
}

const QueueWrapper: FunctionComponent<Props> = ({
  singleView,
  card,
  comments,
  selected,
}) => {
  if (singleView) {
    return (
      <>
        {comments
          // FIXME (Nick/Wyatt): Investigate why comments are coming back null
          .filter((c) => Boolean(c))
          .map((c, i) => {
            if (i === selected) {
              return card(c, i);
            }
            return null;
          })}
      </>
    );
  }
  return (
    <TransitionGroup component={null} appear={false} enter={false} exit>
      {comments
        // FIXME (Nick/Wyatt): Investigate why comments are coming back null
        .filter((c) => Boolean(c))
        .map((c, i) => (
          <CSSTransition
            key={c.id}
            timeout={400}
            classNames={{
              exit: singleView
                ? styles.exitTransitionSingle
                : styles.exitTransition,
              exitActive: styles.exitTransitionActive,
              exitDone: styles.exitTransitionDone,
            }}
          >
            {card(c, i)}
          </CSSTransition>
        ))}
    </TransitionGroup>
  );
};

export default QueueWrapper;
