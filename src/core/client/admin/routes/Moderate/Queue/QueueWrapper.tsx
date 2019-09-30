import ModerateCardContainer from "coral-admin/components/ModerateCard";
import { PropTypesOf } from "coral-ui/types";
import React, { FunctionComponent, ReactNode } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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
}

const QueueWrapper: FunctionComponent<Props> = ({
  singleView,
  card,
  comments,
}) => {
  const commentsQueue = singleView ? [comments[0]] : comments;
  if (singleView) {
    return (
      <>
        {commentsQueue
          // FIXME (Nick/Wyatt): Investigate why comments are coming back null
          .filter(c => Boolean(c))
          .map((c, i) => card(c, i))}
      </>
    );
  }
  return (
    <TransitionGroup component={null} appear={false} enter={false} exit>
      {commentsQueue
        // FIXME (Nick/Wyatt): Investigate why comments are coming back null
        .filter(c => Boolean(c))
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
