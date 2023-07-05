import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { BaseButton } from "coral-ui/components/v2";

import styles from "./FeatureButton.css";

interface Props extends Omit<PropTypesOf<typeof BaseButton>, "ref"> {
  featured: boolean;
  enabled?: boolean;
}

const FeatureButton: FunctionComponent<Props> = ({
  featured,
  enabled = true,
  className,
  ...rest
}) => (
  <BaseButton
    {...rest}
    className={cn(className, styles.root, {
      [styles.invert]: featured,
    })}
    disabled={!enabled}
  >
    {featured ? (
      <Localized id="moderate-comment-featuredText">
        <span>Featured</span>
      </Localized>
    ) : (
      <Localized id="moderate-comment-featureText">
        <span>Feature</span>
      </Localized>
    )}
  </BaseButton>
);

export default FeatureButton;
