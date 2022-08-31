import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { Field, FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import { parseBool } from "coral-framework/lib/form";
import {
  CheckBox,
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

import styles from "./RTEConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment RTEConfig_formValues on Settings {
    rte {
      enabled
      strikethrough
      spoiler
    }
  }
`;

interface Props {
  disabled: boolean;
}

const RTEConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-rte-title">
        <Header container={<legend />}>Rich-text comments</Header>
      </Localized>
    }
    container={<FieldSet />}
    data-testid="rte-config-box"
  >
    <Localized id="configure-general-rte-express">
      <FormFieldDescription>
        Give your community more ways to express themselves beyond plain text
        with rich-text formatting.
      </FormFieldDescription>
    </Localized>

    <FormField container={<fieldset />}>
      <Localized id="configure-general-rte-richTextComments">
        <Label>Rich-Text comments</Label>
      </Localized>
      <OnOffField
        name="rte.enabled"
        disabled={disabled}
        onLabel={
          <Localized id="configure-general-rte-onBasicFeatures">
            <span>On - bold, italics, block quotes, and bulleted lists</span>
          </Localized>
        }
        testIDs={{ on: "rte-config-onField", off: "rte-config-offField" }}
      />
    </FormField>
    <FormSpy subscription={{ values: true }}>
      {(props) => {
        const rteDisabled = !props.values.rte.enabled;
        return (
          <>
            <FormField container={<fieldset />}>
              <Localized id="configure-general-rte-additional">
                <Label
                  className={cn({
                    [styles.disabledLabel]: rteDisabled,
                  })}
                >
                  Additional rich-text options
                </Label>
              </Localized>
              <Field name="rte.strikethrough" type="checkbox" parse={parseBool}>
                {({ input }) => (
                  <Localized id="configure-general-rte-strikethrough">
                    <CheckBox
                      {...input}
                      id={input.name}
                      disabled={rteDisabled || disabled}
                    >
                      Strikethrough
                    </CheckBox>
                  </Localized>
                )}
              </Field>
              <Field name="rte.spoiler" type="checkbox" parse={parseBool}>
                {({ input }) => (
                  <div>
                    <Localized id="configure-general-rte-spoiler">
                      <CheckBox
                        {...input}
                        id={input.name}
                        disabled={rteDisabled || disabled}
                      >
                        Spoiler
                      </CheckBox>
                    </Localized>
                    <Localized id="configure-general-rte-spoilerDesc">
                      <div className={styles.spoilerDesc}>
                        Words and phrases formatted as Spoiler are hidden behind
                        a dark background until the reader chooses to reveal the
                        text.
                      </div>
                    </Localized>
                  </div>
                )}
              </Field>
            </FormField>
          </>
        );
      }}
    </FormSpy>
  </ConfigBox>
);

export default RTEConfig;
