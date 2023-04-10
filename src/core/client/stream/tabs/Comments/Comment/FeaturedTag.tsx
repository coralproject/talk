import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { StarIcon, SvgIcon } from "coral-ui/components/icons";
import { Tag } from "coral-ui/components/v2";

interface Props {
  collapsed?: boolean;
}

const FeaturedTag: FunctionComponent<Props> = ({ collapsed }) => {
  return collapsed ? (
    <SvgIcon color="stream" filled Icon={StarIcon} />
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
