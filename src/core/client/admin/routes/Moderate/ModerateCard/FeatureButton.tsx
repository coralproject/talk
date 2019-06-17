import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { BaseButton } from "coral-ui/components";

import styles from "./FeatureButton.css";

interface Props extends PropTypesOf<typeof BaseButton> {
  featured: boolean;
}

const FeatureButton: FunctionComponent<Props> = ({
  featured,
  className,
  ...rest
}) => (
  <Localized id="moderate-comment-featureButton" attrs={{ "aria-label": true }}>
    <BaseButton
      {...rest}
      className={cn(className, styles.root, {
        [styles.invert]: featured,
      })}
      aria-label="Reject"
    >
      {featured ? "Featured" : "Feature"}
    </BaseButton>
  </Localized>
);

export default FeatureButton;
