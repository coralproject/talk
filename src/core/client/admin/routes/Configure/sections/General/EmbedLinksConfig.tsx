import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import { colorFromMeta } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
  PasswordField,
  RadioButton,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import Subheader from "../../Subheader";

import styles from "./EmbedLinksConfig.css";

interface Props {
  disabled: boolean;
}

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment EmbedLinksConfig_formValues on Settings {
    embeds {
      twitter
      youtube
      giphy
      giphyMaxRating
      giphyAPIKey
    }
  }
`;

const EmbedLinksConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-general-embedLinks-title">
          <Header container={<legend />}>Embedded media</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <Localized id="configure-general-embedLinks-desc">
        <FormFieldDescription>
          Allow commenters to add a YouTube video, Tweet or GIF from GIPHY's
          library to the end of their comment
        </FormFieldDescription>
      </Localized>
      <FormField>
        <Localized id="configure-general-embedLinks-enableTwitterEmbeds">
          <Label component="legend">Allow Twitter embeds</Label>
        </Localized>
        <OnOffField
          name="embeds.twitter"
          disabled={disabled}
          onLabel={
            <Localized id="configure-general-embedLinks-On">
              <span>Yes</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>No</span>
            </Localized>
          }
        />
      </FormField>

      <FormField>
        <Localized id="configure-general-embedLinks-enableYouTubeEmbeds">
          <Label component="legend">Enable YouTube embeds</Label>
        </Localized>
        <OnOffField
          name="embeds.youtube"
          disabled={disabled}
          onLabel={
            <Localized id="configure-general-embedLinks-On">
              <span>Yes</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>No</span>
            </Localized>
          }
        />
      </FormField>
      <FormField>
        <Localized id="configure-general-embedLinks-enableGiphyEmbeds">
          <Label component="legend">Allow GIFs from GIPHY</Label>
        </Localized>
        <OnOffField
          name="embeds.giphy"
          disabled={disabled}
          onLabel={
            <Localized id="configure-general-embedLinks-On">
              <span>Yes</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>No</span>
            </Localized>
          }
        />
      </FormField>
      <FormSpy subscription={{ values: true }}>
        {(props) => {
          const giphyDisabled = !props.values.embeds.giphy;
          return (
            <>
              <FormField>
                <Localized id="configure-general-embedLinks-giphyMaxRating">
                  <Label component="legend">GIF content rating</Label>
                </Localized>
                <Localized id="configure-general-embedLinks-giphyMaxRating-desc">
                  <HelperText>
                    Select the maximum content rating for the GIFs that will
                    appear in commenters’ search results
                  </HelperText>
                </Localized>
                <Field name="embeds.giphyMaxRating" type="radio" value="G">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-g">
                        <RadioButton
                          {...input}
                          id="G"
                          disabled={giphyDisabled || disabled}
                        >
                          G
                        </RadioButton>
                      </Localized>

                      <Localized id="configure-general-embedLinks-giphyMaxRating-g-desc">
                        <div className={styles.ratingDesc}>
                          Content that is appropriate for all ages
                        </div>
                      </Localized>
                    </>
                  )}
                </Field>
                <Field name="embeds.giphyMaxRating" type="radio" value="PG">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-pg">
                        <RadioButton
                          {...input}
                          id="PG"
                          disabled={giphyDisabled || disabled}
                        >
                          PG
                        </RadioButton>
                      </Localized>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-pg-desc">
                        <div className={styles.ratingDesc}>
                          Content that is generally safe for everyone, but
                          parental guidance for children is advised.
                        </div>
                      </Localized>
                    </>
                  )}
                </Field>
                <Field name="embeds.giphyMaxRating" type="radio" value="PG13">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-pg13">
                        <RadioButton
                          {...input}
                          id="PG13"
                          disabled={giphyDisabled || disabled}
                        >
                          PG-13
                        </RadioButton>
                      </Localized>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-pg13-desc">
                        <div className={styles.ratingDesc}>
                          Mild sexual innuendos, mild substance use, mild
                          profanity, or threatening images. May include images
                          of semi-naked people, but DOES NOT show real human
                          genitalia or nudity.
                        </div>
                      </Localized>
                    </>
                  )}
                </Field>
                <Field name="embeds.giphyMaxRating" type="radio" value="R">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-r">
                        <RadioButton
                          {...input}
                          id="r"
                          disabled={giphyDisabled || disabled}
                        >
                          R
                        </RadioButton>
                      </Localized>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-r-desc">
                        <div className={styles.ratingDesc}>
                          Strong language, strong sexual innuendo, violence, and
                          illegal drug use; not suitable for teens or younger.
                          No nudity.
                        </div>
                      </Localized>
                    </>
                  )}
                </Field>
              </FormField>
              <Localized id="configure-general-embedLinks-configuration">
                <Subheader>Configuration</Subheader>
              </Localized>
              <Localized
                id="configure-general-embedLinks-configuration-desc"
                externalLink={
                  <ExternalLink
                    href={"https://developers.giphy.com/docs/api"}
                  />
                }
              >
                <HelperText>
                  For additional information on GIPHY’s API please visit:
                  https://developers.giphy.com/docs/api
                </HelperText>
              </Localized>
              <FormField>
                <Localized id="configure-general-embedLinks-giphyAPIKey">
                  <Label>GIPHY API Key</Label>
                </Localized>
                <Field name="embeds.giphyAPIKey">
                  {({ input, meta }) => (
                    <PasswordField
                      {...input}
                      disabled={giphyDisabled || disabled}
                      hidePasswordTitle="Hide API Key"
                      showPasswordTitle="Show API Key"
                      color={colorFromMeta(meta)}
                      fullWidth
                    />
                  )}
                </Field>
              </FormField>
            </>
          );
        }}
      </FormSpy>
    </ConfigBox>
  );
};

export default EmbedLinksConfig;
