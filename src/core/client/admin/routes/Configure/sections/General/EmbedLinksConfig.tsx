import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import {
  FieldSet,
  FormField,
  Label,
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
      <FormField>
        <Localized id="configure-general-embedLinks-giphyMaxRating">
          <Label component="legend">
            Maximum allowed rating for Giphy embeds
          </Label>
        </Localized>
        <FormSpy subscription={{ values: true }}>
          {(props) => {
            const ratingDisabled = !props.values.embeds.giphy;
            return (
              <>
                <Field name="embeds.giphyMaxRating" type="radio" value="G">
                  {({ input }) => (
                    <Localized id="configure-general-embedLinks-giphyMaxRating-g">
                      <RadioButton
                        {...input}
                        id="G"
                        disabled={ratingDisabled || disabled}
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
                        disabled={ratingDisabled || disabled}
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
                        disabled={ratingDisabled || disabled}
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
                        disabled={ratingDisabled || disabled}
                      >
                        R
                      </RadioButton>
                    </Localized>
                  )}
                </Field>
              </>
            );
          }}
        </FormSpy>
      </FormField>
    </ConfigBox>
  );
};

export default EmbedLinksConfig;
