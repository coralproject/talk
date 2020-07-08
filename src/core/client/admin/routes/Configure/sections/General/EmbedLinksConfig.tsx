import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import { colorFromMeta } from "coral-framework/lib/form";
import {
  FieldSet,
  FormField,
  Label,
  PasswordField,
  RadioButton,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

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
          <Header container={<legend />}>Embed links</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <FormField>
        <Localized id="configure-general-embedLinks-enableTwitterEmbeds">
          <Label component="legend">Enable Twitter embeds</Label>
        </Localized>
        <OnOffField
          name="embeds.twitter"
          disabled={disabled}
          onLabel={
            <Localized id="configure-general-embedLinks-On">
              <span>On</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>Off</span>
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
              <span>On</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>Off</span>
            </Localized>
          }
        />
      </FormField>
      <FormField>
        <Localized id="configure-general-embedLinks-enableGiphyEmbeds">
          <Label component="legend">Enable Giphy embeds</Label>
        </Localized>
        <OnOffField
          name="embeds.giphy"
          disabled={disabled}
          onLabel={
            <Localized id="configure-general-embedLinks-On">
              <span>On</span>
            </Localized>
          }
          offLabel={
            <Localized id="configure-general-embedLinks-Off">
              <span>Off</span>
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
                  <Label component="legend">
                    Maximum allowed rating for Giphy embeds
                  </Label>
                </Localized>
                <Field name="embeds.giphyMaxRating" type="radio" value="G">
                  {({ input }) => (
                    <Localized id="configure-general-embedLinks-giphyMaxRating-g">
                      <RadioButton
                        {...input}
                        id="G"
                        disabled={giphyDisabled || disabled}
                      >
                        G
                      </RadioButton>
                    </Localized>
                  )}
                </Field>
                <Field name="embeds.giphyMaxRating" type="radio" value="PG">
                  {({ input }) => (
                    <Localized id="configure-general-embedLinks-giphyMaxRating-pg">
                      <RadioButton
                        {...input}
                        id="PG"
                        disabled={giphyDisabled || disabled}
                      >
                        PG
                      </RadioButton>
                    </Localized>
                  )}
                </Field>
                <Field name="embeds.giphyMaxRating" type="radio" value="PG13">
                  {({ input }) => (
                    <Localized id="configure-general-embedLinks-giphyMaxRating-pg13">
                      <RadioButton
                        {...input}
                        id="PG13"
                        disabled={giphyDisabled || disabled}
                      >
                        PG-13
                      </RadioButton>
                    </Localized>
                  )}
                </Field>
                <Field name="embeds.giphyMaxRating" type="radio" value="R">
                  {({ input }) => (
                    <Localized id="configure-general-embedLinks-giphyMaxRating-r">
                      <RadioButton
                        {...input}
                        id="r"
                        disabled={giphyDisabled || disabled}
                      >
                        R
                      </RadioButton>
                    </Localized>
                  )}
                </Field>
              </FormField>
              <FormField>
                <Localized id="configure-general-embedLinks-giphyAPIKey">
                  <Label>Giphy API Key</Label>
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
