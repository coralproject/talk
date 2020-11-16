import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, Icon } from "coral-ui/components/v2";
import { Button, StarRating } from "coral-ui/components/v3";

import styles from "./PostReviewOrQuestion.css";

export type Toggle = "RATE_AND_REVIEW" | "ASK_A_QUESTION";
export type OnToggle = (tab: Toggle) => void;

interface Props {
  toggle?: Toggle;
  onToggle: OnToggle;
  rating?: number;
  onShowReview?: () => void;
}

const PostReviewOrQuestion: FunctionComponent<Props> = ({
  toggle: tab,
  onToggle: onChangeTab,
  rating,
  onShowReview: onClickReview,
}) => {
  return (
    <Flex>
      {rating ? (
        onClickReview ? (
          <div
            className={cn(styles.button, styles.rated, styles.showReviewButton)}
          >
            <span className={styles.ratedThis}>You rated this</span>
            <StarRating className={styles.icon} rating={rating} />
            <Button
              variant="none"
              onClick={onClickReview}
              className={styles.showReview}
            >
              Show review
            </Button>
          </div>
        ) : (
          <Button
            color="none"
            variant="outlined"
            className={cn(styles.button, styles.rated)}
            disabled
          >
            <span className={styles.ratedThis}>You rated this</span>
            <StarRating rating={rating} />
          </Button>
        )
      ) : (
        <Button
          color="none"
          variant="outlined"
          className={cn(styles.button, {
            [styles.selected]: tab === "RATE_AND_REVIEW",
            [styles.unselected]: tab === "ASK_A_QUESTION",
          })}
          disabled={tab === "RATE_AND_REVIEW"}
          onClick={() => onChangeTab("RATE_AND_REVIEW")}
        >
          <Icon size="lg" className={styles.icon}>
            star_border
          </Icon>
          <span>Rate and Review</span>
        </Button>
      )}
      <Button
        color="none"
        variant="outlined"
        className={cn(styles.button, {
          [styles.selected]: tab === "ASK_A_QUESTION",
          [styles.unselected]: tab === "RATE_AND_REVIEW",
        })}
        disabled={tab === "ASK_A_QUESTION"}
        onClick={() => onChangeTab("ASK_A_QUESTION")}
      >
        <Icon size="lg" className={styles.icon}>
          help_outline
        </Icon>
        <span>Ask a Question</span>
      </Button>
    </Flex>
  );
};

export default PostReviewOrQuestion;
