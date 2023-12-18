import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { RatingStarIcon, SvgIcon } from "coral-ui/components/icons";
import { Flex, Tag } from "coral-ui/components/v2";

import styles from "./FeaturedTag.css";

interface Props {
  collapsed?: boolean;
  topCommenterEnabled?: boolean | null;
}

const FeaturedTag: FunctionComponent<Props> = ({
  collapsed,
  topCommenterEnabled,
}) => {
  return collapsed ? (
    <SvgIcon color="stream" filled="currentColor" Icon={RatingStarIcon} />
  ) : (
    <div>
      <Tag
        className={CLASSES.comment.topBar.featuredTag}
        color="streamBlue"
        variant="pill"
      >
        <Flex>
          {topCommenterEnabled && (
            <SvgIcon
              className={styles.starIcon}
              size="xxs"
              Icon={RatingStarIcon}
            />
          )}
          <Localized id="comments-featuredTag">
            <span>Featured</span>
          </Localized>
        </Flex>
      </Tag>
    </div>
  );
};

export default FeaturedTag;
