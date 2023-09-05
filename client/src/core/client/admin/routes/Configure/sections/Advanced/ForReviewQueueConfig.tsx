import { Localized } from "@fluent/react/compat";
import React, { FC } from "react";
import { graphql } from "react-relay";

import { FormField, FormFieldDescription, Label } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ForReviewQueueConfig_formValues on Settings {
    forReviewQueue
  }
`;

interface Props {
  disabled: boolean;
}

const ForReviewQueueConfig: FC<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-for-review-queue">
        <Header htmlFor="configure-advanced-for-review-queue">
          Review all user reports
        </Header>
      </Localized>
    }
    data-testid="for-review-queue-config-box"
  >
    <FormField>
      <Localized id="configure-advanced-for-review-queue-explanation">
        <FormFieldDescription>
          Once a comment is approved, it won't appear again in the reported
          queue even if additional users report it. This feature adds a "For
          review" queue, allowing moderators to see all user reports in the
          system, and manually mark them as "Reviewed".
        </FormFieldDescription>
      </Localized>
      <Localized id="configure-advanced-for-review-queue-label">
        <Label component="legend">Show "For review" queue</Label>
      </Localized>
      <OnOffField name="forReviewQueue" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default ForReviewQueueConfig;
