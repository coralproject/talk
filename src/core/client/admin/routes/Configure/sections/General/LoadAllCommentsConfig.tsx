import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment LoadAllCommentsConfig_formValues on Settings {
    loadAllComments
  }
`;

interface Props {
  disabled: boolean;
}

const LoadAllCommentsConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-loadAllComments-title">
        <Header container="h2">Load everything</Header>
      </Localized>
    }
  >
    <Localized id="configure-general-loadAllComments-explanation">
      <FormFieldDescription>
        Change how long streams display. When enabled, the reader will have to
        scroll past all of the comments to get to any content below, no matter
        how many comments are on the page. When disabled, long comment streams
        will be paused with a "Load All Comments" button after 20 top-level
        comments, so that readers can easily move past the comments if they
        don't want to read them all.
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-loadAllComments-enabled">
        <Label component="legend">Load everything enabled</Label>
      </Localized>
      <OnOffField name="loadAllComments" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default LoadAllCommentsConfig;
