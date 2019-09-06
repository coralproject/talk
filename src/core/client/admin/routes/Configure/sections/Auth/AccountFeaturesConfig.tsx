import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  Typography,
} from "coral-ui/components";
import OnOffField from "../../OnOffField";

import Header from "../../Header";
import SectionContent from "../../SectionContent";

import styles from "./AccountFeaturesConfig.css";

interface Props {
  disabled?: boolean;
}

const AccountFeaturesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <div>
    <HorizontalGutter size="oneAndAHalf">
      <Localized id="configure-account-features-title">
        <Header container="legend">Commenter account mangement features</Header>
      </Localized>
      <SectionContent>
        <Localized id="configure-account-features-explanation">
          <Typography variant="bodyShort">
            You can enable and disable certain features for your commenters to
            use within their Profile. These features also assist towards GDPR
            compliance.
          </Typography>
        </Localized>
        <HorizontalGutter container={<FieldSet />}>
          <Localized id="configure-account-features-allow">
            <Typography variant="heading4">Allow users to:</Typography>
          </Localized>
          <FormField container="fieldset">
            <Flex justifyContent="space-between">
              <HorizontalGutter size="half">
                <Localized id="configure-account-features-change-usernames">
                  <InputLabel container="legend">
                    Change their usernames
                  </InputLabel>
                </Localized>
                <Localized id="configure-account-features-change-usernames-details">
                  <Typography>
                    Usernames can be changed once every 14 days.
                  </Typography>
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
              <HorizontalGutter size="half">
                <Localized id="configure-account-features-download-comments">
                  <InputLabel container="legend">
                    Download their comments
                  </InputLabel>
                </Localized>
                <Localized id="configure-account-features-download-comments-details">
                  <Typography>
                    Commenters can download a csv of their comment history.
                  </Typography>
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
              <HorizontalGutter size="half">
                <Localized id="configure-account-features-delete-account">
                  <InputLabel container="legend">
                    Delete their account
                  </InputLabel>
                </Localized>
                <Localized id="configure-account-features-delete-account-fieldDescriptions">
                  <Typography>
                    Removes all of their comment data, username, and email
                    address from the site and the database.
                  </Typography>
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
