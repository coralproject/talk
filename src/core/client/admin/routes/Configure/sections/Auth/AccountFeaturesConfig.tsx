import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { FieldSet, FormField, Label } from "coral-admin/ui/components";
import { Flex, HorizontalGutter } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";
import SectionContent from "../../SectionContent";

import styles from "./AccountFeaturesConfig.css";

interface Props {
  disabled?: boolean;
}

const AccountFeaturesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <div>
    <HorizontalGutter spacing={3}>
      <Localized id="configure-account-features-title">
        <Header component="legend">Commenter account mangement features</Header>
      </Localized>
      <SectionContent>
        <Localized id="configure-account-features-explanation">
          <Description>
            You can enable and disable certain features for your commenters to
            use within their Profile. These features also assist towards GDPR
            compliance.
          </Description>
        </Localized>
        <HorizontalGutter container={<FieldSet />}>
          <Localized id="configure-account-features-allow">
            <Description>Allow users to:</Description>
          </Localized>
          <FormField container="fieldset">
            <Flex justifyContent="space-between">
              <HorizontalGutter spacing={1}>
                <Localized id="configure-account-features-change-usernames">
                  <Label component="legend">Change their usernames</Label>
                </Localized>
                <Localized id="configure-account-features-change-usernames-details">
                  <HelperText>
                    Usernames can be changed once every 14 days.
                  </HelperText>
                </Localized>
              </HorizontalGutter>
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
        </HorizontalGutter>
        <HorizontalGutter size="double">
          <FormField container="fieldset">
            <Flex justifyContent="space-between">
              <HorizontalGutter spacing={1}>
                <Localized id="configure-account-features-download-comments">
                  <Label component="legend">Download their comments</Label>
                </Localized>
                <Localized id="configure-account-features-download-comments-details">
                  <HelperText>
                    Commenters can download a csv of their comment history.
                  </HelperText>
                </Localized>
              </HorizontalGutter>
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
        </HorizontalGutter>
        <HorizontalGutter size="double">
          <FormField container="fieldset">
            <Flex justifyContent="space-between">
              <HorizontalGutter spacing={1}>
                <Localized id="configure-account-features-delete-account">
                  <Label component="legend">Delete their account</Label>
                </Localized>
                <Localized id="configure-account-features-delete-account-fieldDescriptions">
                  <HelperText>
                    Removes all of their comment data, username, and email
                    address from the site and the database.
                  </HelperText>
                </Localized>
              </HorizontalGutter>
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
        </HorizontalGutter>
      </SectionContent>
    </HorizontalGutter>
  </div>
);

export default AccountFeaturesConfig;
