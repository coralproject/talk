import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Typography } from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

interface Props {
  title?: string | null;
  average: number;
  count: number;
}

const StoryRating: FunctionComponent<Props> = ({ title, average, count }) => {
  return (
    <Flex direction="column" alignItems="center" spacing={2}>
      {title && <Typography variant="heading4">{title}</Typography>}
      <Typography color="textDark" variant="heading1">
        {average.toFixed(1)}
      </Typography>
      <Flex direction="column" alignItems="center" spacing={1}>
        <StarRating rating={average} precision={1} />
        <Localized id="ratingsAndReviews-basedOnRatings" vars={{ count }}>
          <Typography variant="heading5" color="textSecondary">
            Based on {count} ratings
          </Typography>
        </Localized>
      </Flex>
    </Flex>
  );
};

export default StoryRating;
