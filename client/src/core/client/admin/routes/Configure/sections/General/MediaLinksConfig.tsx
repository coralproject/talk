import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { GQLGIF_MEDIA_SOURCE } from "coral-framework/schema";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
  RadioButton,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import Subheader from "../../Subheader";
import APIKeyField from "../Moderation/APIKeyField";

import styles from "./MediaLinksConfig.css";

interface Props {
  disabled: boolean;
}

const giphyIsEnabled: Condition = (value, values) =>
  Boolean(values.media && values.media.gifs.enabled);

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment MediaLinksConfig_formValues on Settings {
    media {
      twitter {
        enabled
      }
      youtube {
        enabled
      }
      gifs {
        enabled
        maxRating
        key
        provider
      }
    }
  }
`;

const MediaLinksConfig: FunctionComponent<Props> = ({ disabled }) => {
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
          Allow commenters to add a YouTube video, X post or GIF from GIPHY's
          library to the end of their comment
        </FormFieldDescription>
      </Localized>
      <FormField>
        <Localized id="configure-general-embedLinks-enableTwitterEmbeds">
          <Label component="legend">Allow X post embeds</Label>
        </Localized>
        <OnOffField
          name="media.twitter.enabled"
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
          <Label component="legend">Allow YouTube embeds</Label>
        </Localized>
        <OnOffField
          name="media.youtube.enabled"
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
        <Localized id="configure-general-embedLinks-enableGifs">
          <Label component="legend">Allow GIFs</Label>
        </Localized>
        <OnOffField
          name="media.gifs.enabled"
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
          const gifsDisabled =
            !props.values.media ||
            !props.values.media.gifs ||
            !props.values.media.gifs.enabled;
          const provider = props.values.media?.gifs?.provider;
          return (
            <>
              <FormField>
                <Localized id="configure-general-embedLinks-gifProvider">
                  <Label component="legend">GIF provider</Label>
                </Localized>
                <Localized id="configure-general-embedLinks-gifProvider-desc">
                  <HelperText>
                    Determines which provider commenters will search for and
                    show GIFs from.
                  </HelperText>
                </Localized>
                <Field name="media.gifs.provider" type="radio" value="GIPHY">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-gifs-provider-Giphy">
                        <RadioButton
                          {...input}
                          id="GIPHY"
                          disabled={gifsDisabled || disabled}
                        >
                          Giphy
                        </RadioButton>
                      </Localized>
                    </>
                  )}
                </Field>
                <Field name="media.gifs.provider" type="radio" value="TENOR">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-gifs-provider-Tenor">
                        <RadioButton
                          {...input}
                          id="TENOR"
                          disabled={gifsDisabled || disabled}
                        >
                          Tenor
                        </RadioButton>
                      </Localized>
                    </>
                  )}
                </Field>
              </FormField>
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
                <Field name="media.gifs.maxRating" type="radio" value="g">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-g">
                        <RadioButton
                          {...input}
                          id="G"
                          disabled={gifsDisabled || disabled}
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
                <Field name="media.gifs.maxRating" type="radio" value="pg">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-pg">
                        <RadioButton
                          {...input}
                          id="PG"
                          disabled={gifsDisabled || disabled}
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
                <Field name="media.gifs.maxRating" type="radio" value="pg13">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-pg13">
                        <RadioButton
                          {...input}
                          id="PG13"
                          disabled={gifsDisabled || disabled}
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
                <Field name="media.gifs.maxRating" type="radio" value="r">
                  {({ input }) => (
                    <>
                      <Localized id="configure-general-embedLinks-giphyMaxRating-r">
                        <RadioButton
                          {...input}
                          id="r"
                          disabled={gifsDisabled || disabled}
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

              {provider === GQLGIF_MEDIA_SOURCE.GIPHY && (
                <Localized
                  id="configure-general-embedLinks-configuration-giphy-desc"
                  elems={{
                    externalLink: (
                      <ExternalLink
                        href={"https://developers.giphy.com/docs/api"}
                      />
                    ),
                  }}
                >
                  <HelperText>
                    For additional information on GIPHY’s API please visit:
                    https://developers.giphy.com/docs/api
                  </HelperText>
                </Localized>
              )}

              {provider === GQLGIF_MEDIA_SOURCE.TENOR && (
                <Localized
                  id="configure-general-embedLinks-configuration-tenor-desc"
                  elems={{
                    externalLink: (
                      <ExternalLink
                        href={
                          "https://developers.google.com/tenor/guides/endpoints"
                        }
                      />
                    ),
                  }}
                >
                  <HelperText>
                    For additional information on TENOR’s API please visit:
                    https://developers.google.com/tenor/guides/endpoints
                  </HelperText>
                </Localized>
              )}

              <FormField>
                {provider === GQLGIF_MEDIA_SOURCE.GIPHY && (
                  <Localized id="configure-general-embedLinks-giphyAPIKey">
                    <Label>GIPHY API Key</Label>
                  </Localized>
                )}
                {provider === GQLGIF_MEDIA_SOURCE.TENOR && (
                  <Localized id="configure-general-embedLinks-tenorAPIKey">
                    <Label>TENOR API Key</Label>
                  </Localized>
                )}

                <Field name="media.gifs.key">
                  {({ input, meta }) => (
                    <APIKeyField
                      {...input}
                      disabled={gifsDisabled || disabled}
                      validate={validateWhen(giphyIsEnabled, required)}
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

export default MediaLinksConfig;
