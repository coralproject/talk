import React, { FunctionComponent } from "react";

import { FeaturedStarIcon, SvgIcon } from "coral-ui/components/icons";

import styles from "./FeaturedTag.css";

const FeaturedTag: FunctionComponent = () => {
  return (
    <SvgIcon className={styles.starIcon} size="lg" Icon={FeaturedStarIcon} />
  );
};

export default FeaturedTag;
