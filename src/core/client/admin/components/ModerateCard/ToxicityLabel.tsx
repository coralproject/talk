import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Counter } from "coral-ui/components/v2";

import styles from "./ToxicityLabel.css";

const ToxicityCounter: FunctionComponent<{ score: number }> = ({ score }) => (
  <Counter color="inherit">{Math.round(score * 100)}%</Counter>
);

const ToxicityLabel: FunctionComponent<{
  score: number;
  threshold: number;
}> = ({ score, threshold }) => {
  const counter = <ToxicityCounter score={score} />;

  if (score > threshold) {
    return (
      <Localized id="moderate-toxicityLabel-likely" score={counter}>
        <p className={cn(styles.root, styles.likely)}>
          <span>Likely</span>
        </p>
      </Localized>
    );
  } else if (score <= 0.5) {
    return (
      <Localized id="moderate-toxicityLabel-unlikely" score={counter}>
        <p className={styles.root}>
          <span>Unlikely</span>
        </p>
      </Localized>
    );
  }

  return (
    <Localized id="moderate-toxicityLabel-maybe" score={counter}>
      <p className={styles.root}>
        <span>Maybe</span>
      </p>
    </Localized>
  );
};

export default ToxicityLabel;
