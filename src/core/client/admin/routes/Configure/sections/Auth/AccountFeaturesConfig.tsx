import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components";
import {
  FormField,
  FormFieldDescription,
  FormFieldHeader,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";

import styles from "./AccountFeaturesConfig.css";

interface Props {
  disabled?: boolean;
}

const AccountFeaturesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <div>
    <ConfigBox
      title={
        <Localized id="configure-account-features-title">
          <Header component="legend">
            Commenter account mangement features
          </Header>
        </Localized>
      }
    >
      <Localized id="configure-account-features-explanation">
        <FormFieldDescription>
          You can enable and disable certain features for your commenters to use
          within their Profile. These features also assist towards GDPR
          compliance.
        </FormFieldDescription>
      </Localized>
      <FormField container="fieldset">
        <Localized id="configure-account-features-allow">
          <FormFieldDescription>Allow users to:</FormFieldDescription>
        </Localized>
        <Flex justifyContent="space-between">
          <FormFieldHeader>
            <Localized id="configure-account-features-change-usernames">
              <Label component="legend">Change their usernames</Label>
            </Localized>
            <Localized id="configure-account-features-change-usernames-details">
              <HelperText>
                Usernames can be changed once every 14 days.
              </HelperText>
            </Localized>
          </FormFieldHeader>
          <OnOffField
            name="accountFeatures.changeUsername"
            disabled={disabled || false}
            className={styles.radioButtons}
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
        </Flex>
      </FormField>
      <FormField container="fieldset">
        <Flex justifyContent="space-between">
          <FormFieldHeader>
            <Localized id="configure-account-features-download-comments">
              <Label component="legend">Download their comments</Label>
            </Localized>
            <Localized id="configure-account-features-download-comments-details">
              <HelperText>
                Commenters can download a csv of their comment history.
              </HelperText>
            </Localized>
          </FormFieldHeader>
          <OnOffField
            name="accountFeatures.downloadComments"
            disabled={disabled || false}
            className={styles.radioButtons}
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
        </Flex>
      </FormField>
      <FormField container="fieldset">
        <Flex justifyContent="space-between">
          <FormFieldHeader>
            <Localized id="configure-account-features-delete-account">
              <Label component="legend">Delete their account</Label>
            </Localized>
            <Localized id="configure-account-features-delete-account-fieldDescriptions">
              <HelperText>
                Removes all of their comment data, username, and email address
                from the site and the database.
              </HelperText>
            </Localized>
          </FormFieldHeader>
          <OnOffField
            name="accountFeatures.deleteAccount"
            disabled={disabled || false}
            className={styles.radioButtons}
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
        </Flex>
      </FormField>
    </ConfigBox>
  </div>
);

export default AccountFeaturesConfig;
