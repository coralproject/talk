import { CoralRTE } from "@coralproject/rte";
import React, { Ref } from "react";
import { graphql, useFragment } from "react-relay";

import { convertGQLRTEConfigToRTEFeatures } from "coral-common/helpers/sanitize";
import { withForwardRef } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import { RTEContainer_config$key } from "coral-stream/__generated__/RTEContainer_config.graphql";

import RTE from "./RTE";

interface Props extends Omit<PropTypesOf<typeof RTE>, "ref"> {
  forwardRef: Ref<CoralRTE>;
  config: RTEContainer_config$key;
  toolbarButtons?: React.ReactElement | null;
}

const RTEContainer: React.FunctionComponent<Props> = ({ config, ...rest }) => {
  const configData = useFragment(
    graphql`
      fragment RTEContainer_config on RTEConfiguration {
        enabled
        strikethrough
        spoiler
        sarcasm
      }
    `,
    config
  );

  const features: Partial<
    PropTypesOf<typeof RTE>["features"]
  > = convertGQLRTEConfigToRTEFeatures(configData);

  return <RTE features={features} {...rest} />;
};

const enhanced = withForwardRef(RTEContainer);
export default enhanced;
