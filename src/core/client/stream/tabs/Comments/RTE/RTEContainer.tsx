import { CoralRTE } from "@coralproject/rte";
import React, { Ref } from "react";
import { graphql } from "react-relay";

import { convertGQLRTEConfigToRTEFeatures } from "coral-common/helpers/sanitize";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { withForwardRef } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import { RTEContainer_config } from "coral-stream/__generated__/RTEContainer_config.graphql";

import RTE from "./RTE";

export interface RTEFeatureOverrides {
  bold: boolean;
  italic: boolean;
  blockquote: boolean;
  bulletList: boolean;
}

interface Props extends Omit<PropTypesOf<typeof RTE>, "ref"> {
  forwardRef: Ref<CoralRTE>;
  config: RTEContainer_config;
  toolbarButtons?: React.ReactElement | null;
  featureOverrides?: RTEFeatureOverrides;
}

const RTEContainer: React.FunctionComponent<Props> = ({
  config,
  featureOverrides: overrides,
  ...rest
}) => {
  const features: Partial<
    PropTypesOf<typeof RTE>["features"]
  > = convertGQLRTEConfigToRTEFeatures(config);

  if (overrides) {
    features.bold = overrides.bold;
    features.italic = overrides.italic;
    features.blockquote = overrides.blockquote;
    features.bulletList = overrides.bulletList;
  }

  return <RTE features={features} {...rest} />;
};

const enhanced = withForwardRef(
  withFragmentContainer<Props>({
    config: graphql`
      fragment RTEContainer_config on RTEConfiguration {
        enabled
        strikethrough
        spoiler
        sarcasm
      }
    `,
  })(RTEContainer)
);
export default enhanced;
