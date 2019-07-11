import React, { FunctionComponent } from "react";

import { HorizontalGutter, Typography } from "coral-ui/components";

interface Props {
  category: React.ReactNode;
  children?: React.ReactNode;
}

const FlagDetailsCategory: FunctionComponent<Props> = ({
  category,
  children,
}) => {
  return (
    <HorizontalGutter size="half">
      <Typography variant="bodyCopyBold">{category}</Typography>
      <HorizontalGutter size="half">{children}</HorizontalGutter>
    </HorizontalGutter>
  );
};

export default FlagDetailsCategory;
