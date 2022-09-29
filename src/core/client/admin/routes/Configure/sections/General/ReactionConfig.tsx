import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

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

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./ReactionConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ReactionConfig_formValues on Settings {
    reaction {
      label
      labelActive
      sortLabel
      icon
      iconActive
    }
  }
`;

interface Props {
  icon: string;
  iconActive: string | null;
  disabled: boolean;
}

const ReactionsConfig: FunctionComponent<Props> = ({
  disabled,
  icon,
  iconActive,
}) => (
  <ConfigBox
    title={
      <Localized id="configure-general-reactions-title">
        <Header container={<legend />}>Reactions</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized
      id="configure-general-reactions-explanation"
      elems={{ strong: <strong /> }}
    >
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
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Respect"
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-reactions-preview">
              <Label component="p">Preview</Label>
            </Localized>
            <ReactionButton
              author=""
              readOnly
              className={styles.reactionButton}
              reacted={false}
              label={input.value}
              labelActive={input.value}
              icon={icon}
              iconActive={iconActive}
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
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                placeholder="E.g. Respected"
                fullWidth
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-reactions-preview">
              <Label component="p">Preview</Label>
            </Localized>
            <ReactionButton
              author=""
              className={styles.reactionButton}
              readOnly
              reacted
              label={input.value}
              labelActive={input.value}
              icon={icon}
              iconActive={iconActive}
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
                {...input}
                id={input.name}
                className={styles.textInput}
                type="text"
                placeholder="E.g. Most respected"
                fullWidth
                disabled={disabled}
                meta={meta}
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
