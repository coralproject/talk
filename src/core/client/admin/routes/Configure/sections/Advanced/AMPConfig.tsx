import { Localized } from "@fluent/react/compat";
import React, { FC } from "react";
import { graphql } from "react-relay";

import { FormField, FormFieldDescription } from "coral-ui/components/v2";
import Link from "coral-ui/components/v3/Link";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment AMPConfig_formValues on Settings {
    amp
  }
`;

const LinkToAMP: FC = ({ children }) => (
  <Link href="https://amp.dev/">{children}</Link>
);

const LinkToDocs: FC = ({ children }) => (
  <Link href="/docs/amp">{children}</Link>
);

interface Props {
  disabled: boolean;
}

const AMPConfig: FC<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-amp">
        <Header htmlFor="configure-advanced-amp">
          Accelerated Mobile Pages
        </Header>
      </Localized>
    }
  >
    <FormField>
      <Localized
        id="configure-advanced-amp-explanation"
        LinkToAMP={<LinkToAMP />}
        LinkToDocs={<LinkToDocs />}
      >
        <FormFieldDescription>
          Enable support for <LinkToAMP>AMP</LinkToAMP> on the comment stream.
          Once enabled, you will need to add Coral’s AMP embed code to your page
          template. See our <LinkToDocs>documentation</LinkToDocs> for more
          details. Enable Enable Support.
        </FormFieldDescription>
      </Localized>
      <OnOffField name="amp" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default AMPConfig;
