import { CoralRTE } from "@coralproject/rte";
import React, { Ref } from "react";
import { graphql } from "react-relay";

import { convertGQLRTEConfigToRTEFeatures } from "coral-common/helpers/sanitize";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { withForwardRef } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import { RTEContainer_config } from "coral-stream/__generated__/RTEContainer_config.graphql";

import RTE from "./RTE";

interface Props extends Omit<PropTypesOf<typeof RTE>, "ref"> {
  forwardRef: Ref<CoralRTE>;
  config: RTEContainer_config;
  toolbarButtons?: React.ReactElement | null;
}

const RTEContainer: React.FunctionComponent<Props> = ({ config, ...rest }) => {
  const features: Partial<PropTypesOf<typeof RTE>["features"]> =
    convertGQLRTEConfigToRTEFeatures(config);
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
