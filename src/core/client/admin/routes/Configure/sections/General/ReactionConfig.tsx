import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { required } from "coral-framework/lib/validation";
import ReactionButton from "coral-stream/tabs/Comments/Comment/ReactionButton/ReactionButton";
import {
  FieldSet,
  Flex,
  FormField,
  FormFieldDescription,
  HorizontalGutter,
  Label,
  Option,
  SelectField,
} from "coral-ui/components/v2";

import { ReactionConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ReactionConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./ReactionConfig.css";

interface Props {
  disabled: boolean;
  settings: SettingsData;
}

const ReactionsConfig: FunctionComponent<Props> = ({ disabled, settings }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-reactions-title">
        <Header container={<legend />}>Reactions</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized id="configure-general-reactions-explanation" strong={<strong />}>
      <FormFieldDescription>
        Allow your community to engage with one another and express themselves
        with one-click reactions. By default, Coral allows commenters to
        "Respect" each other's comments, but you may customize reaction text
        based on the needs of your community.
      </FormFieldDescription>
    </Localized>
    <Field name="reaction.label" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-reactions-label">
              <Label>Reaction label</Label>
            </Localized>
            <Localized id="configure-general-reactions-input">
              <TextFieldWithValidation
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Respect"
                disabled={disabled}
                meta={meta}
                {...input}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-reactions-preview">
              <Label component="p">Preview</Label>
            </Localized>
            <ReactionButton
              readOnly
              className={styles.reactionButton}
              reacted={false}
              label={input.value}
              labelActive={settings.reaction.labelActive}
              icon={settings.reaction.icon}
              iconActive={settings.reaction.iconActive}
              totalReactions={0}
              onClick={() => null}
            />
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
    <Field name="reaction.labelActive" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-reactions-active-label">
              <Label>Active reaction label</Label>
            </Localized>
            <Localized id="configure-general-reactions-active-input">
              <TextFieldWithValidation
                className={styles.textInput}
                id={input.name}
                type="text"
                placeholder="E.g. Respected"
                fullWidth
                disabled={disabled}
                meta={meta}
                {...input}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-reactions-preview">
              <Label component="p">Preview</Label>
            </Localized>
            <ReactionButton
              className={styles.reactionButton}
              readOnly
              reacted
              label={settings.reaction.label}
              labelActive={input.value}
              icon={settings.reaction.icon}
              iconActive={settings.reaction.iconActive}
              totalReactions={0}
              onClick={() => null}
            />
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
    <Field name="reaction.sortLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-reactions-sort-label">
              <Label>Sort label</Label>
            </Localized>
            <Localized id="configure-general-reactions-sort-input">
              <TextFieldWithValidation
                id={input.name}
                className={styles.textInput}
                type="text"
                placeholder="E.g. Most respected"
                fullWidth
                disabled={disabled}
                meta={meta}
                {...input}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-reactions-preview">
              <Label component="p">Preview</Label>
            </Localized>
            <Flex justifyContent="center" alignItems="center" itemGutter>
              <Localized id="configure-general-reaction-sortMenu-sortBy">
                <Label component="p">Sort By</Label>
              </Localized>
              <SelectField>
                <Option value={input.value}>{input.value}</Option>{" "}
              </SelectField>
            </Flex>
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
  </ConfigBox>
);

export default ReactionsConfig;
