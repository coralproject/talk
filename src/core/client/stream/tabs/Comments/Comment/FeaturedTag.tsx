import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Icon, Tag } from "coral-ui/components/v2";

import styles from "./FeaturedTag.css";

interface Props {
  collapsed?: boolean;
}

const FeaturedTag: FunctionComponent<Props> = ({ collapsed }) => {
  return collapsed ? (
    <Icon className={styles.root}>star</Icon>
  ) : (
    <div>
      <Tag
        className={CLASSES.comment.topBar.featuredTag}
        color="streamBlue"
        variant="pill"
      >
        <Localized id="comments-featuredTag">
          <span>Featured</span>
        </Localized>
      </Tag>
    </div>
  );
};

export default FeaturedTag;
