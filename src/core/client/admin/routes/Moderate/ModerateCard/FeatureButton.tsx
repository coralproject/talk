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
  <BaseButton
    {...rest}
    className={cn(className, styles.root, {
      [styles.invert]: featured,
    })}
  >
    {featured ? (
      <Localized id="moderate-comment-featuredText" />
    ) : (
      <Localized id="moderate-comment-featureText" />
    )}
  </BaseButton>
);

export default FeatureButton;
