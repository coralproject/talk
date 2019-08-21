import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  Option,
  SelectField,
  TextField,
  Typography,
} from "coral-ui/components";
import OnOffField from "../../OnOffField";

import Header from "../../Header";

interface Props {
  disabled?: boolean;
}

const AccountFeaturesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <Localized id="configure-account-features-title">
      <Header container="legend">Commenter account mangement features</Header>
    </Localized>
    <Localized id="configure-account-features-explanation" strong={<strong />}>
      <Typography variant="detail">
        You can enable and disable certain features for your commenters to use
        within their Profile. These features also assist towards GDPR
        compliance.
      </Typography>
    </Localized>
    <HorizontalGutter size="double">
      <FormField container="fieldset">
        <Localized id="configure-account-features-change-usernames">
          <InputLabel container="legend">Change their usernames</InputLabel>
        </Localized>
        <OnOffField
          name="accountFeatures.changeUsername"
          disabled={disabled || false}
          onLabel={
            <Localized id="configure-account-features-yes">
              <span>Yes</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-account-features-no">
              <span>No</span>
            </Localized>
          }
        />
      </FormField>
    </HorizontalGutter>
    <HorizontalGutter size="double">
      <FormField container="fieldset">
        <Localized id="configure-account-features-download-comments">
          <InputLabel container="legend">Download their comments</InputLabel>
        </Localized>
        <OnOffField
          name="accountFeatures.downloadComments"
          disabled={disabled || false}
          onLabel={
            <Localized id="configure-account-features-yes">
              <span>Yes</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-account-features-no">
              <span>No</span>
            </Localized>
          }
        />
      </FormField>
    </HorizontalGutter>
    <HorizontalGutter size="double">
      <FormField container="fieldset">
        <Localized id="configure-account-features-download-comments">
          <InputLabel container="legend">Delete their account</InputLabel>
        </Localized>
        <OnOffField
          name="accountFeatures.deleteAccount"
          disabled={disabled || false}
          onLabel={
            <Localized id="configure-account-features-yes">
              <span>Yes</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-account-features-no">
              <span>No</span>
            </Localized>
          }
        />
      </FormField>
    </HorizontalGutter>
  </HorizontalGutter>
);

export default AccountFeaturesConfig;
