import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { ReactionConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ReactionConfigContainer_settings.graphql";
import { composeValidators, required } from "coral-framework/lib/validation";
import ReactionButton from "coral-stream/tabs/Comments/Comment/ReactionButton/ReactionButton";
import {
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  Option,
  SelectField,
  TextField,
  Typography,
} from "coral-ui/components";
import variables from "coral-ui/theme/variables";

import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

import styles from "./ReactionConfig.css";

interface Props {
  disabled: boolean;
  settings: SettingsData;
}
const ReactionsConfig: FunctionComponent<Props> = ({ disabled, settings }) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <Localized id="configure-general-reactions-title">
      <Header container="legend">Reactions</Header>
    </Localized>
    <Localized id="configure-general-reactions-explanation" strong={<strong />}>
      <Typography variant="detail">
        Allow your community to engage with one another and express themselves
        with one-click reactions. By default, Coral allows commenters to
        "Respect" each other's comments, but you may customize reaction text
        based on the needs of your community.
      </Typography>
    </Localized>
    <HorizontalGutter spacing={3}>
      <Flex itemGutter="double">
        <FormField>
          <Localized id="configure-general-reactions-label">
            <InputLabel>Reaction label</InputLabel>
          </Localized>
          <Field name="reaction.label" validate={required}>
            {({ input, meta }) => (
              <>
                <TextField
                  className={styles.textInput}
                  id={input.name}
                  type="text"
                  fullWidth
                  disabled={disabled}
                  {...input}
                />
                <ValidationMessage fullWidth meta={meta} />
              </>
            )}
          </Field>
        </FormField>
        <div>
          <Localized id="configure-general-reactions-preview">
            <Typography variant="heading3">Preview</Typography>
          </Localized>
          <ReactionButton
            readOnly
            reacted={false}
            label={settings.reaction.label}
            labelActive={settings.reaction.labelActive}
            icon={settings.reaction.icon}
            iconActive={settings.reaction.iconActive}
            totalReactions={0}
            color={variables.palette.grey.main}
            onClick={() => null}
          />
        </div>
      </Flex>
      <Flex itemGutter="double">
        <FormField>
          <Localized id="configure-general-reactions-active-label">
            <InputLabel>Active reaction label</InputLabel>
          </Localized>
          <Field name="reaction.labelActive" validate={required}>
            {({ input, meta }) => (
              <>
                <TextField
                  className={styles.textInput}
                  id={input.name}
                  type="text"
                  fullWidth
                  disabled={disabled}
                  {...input}
                />
                <ValidationMessage fullWidth meta={meta} />
              </>
            )}
          </Field>
        </FormField>
        <div>
          <Localized id="configure-general-reactions-preview">
            <Typography variant="heading3">Preview</Typography>
          </Localized>
          <ReactionButton
            readOnly
            reacted
            label={settings.reaction.label}
            labelActive={settings.reaction.labelActive}
            icon={settings.reaction.icon}
            iconActive={settings.reaction.iconActive}
            totalReactions={0}
            onClick={() => null}
          />
        </div>
      </Flex>
      <Flex itemGutter="double">
        <FormField>
          <Localized id="configure-general-reactions-sort-label">
            <InputLabel>Sort label</InputLabel>
          </Localized>
          <Field name="reaction.sortLabel" validate={required}>
            {({ input, meta }) => (
              <>
                <TextField
                  id={input.name}
                  className={styles.textInput}
                  type="text"
                  fullWidth
                  disabled={disabled}
                  {...input}
                />
                <ValidationMessage fullWidth meta={meta} />
              </>
            )}
          </Field>
        </FormField>
        <div>
          <Localized id="configure-general-reactions-preview">
            <Typography variant="heading3">Preview</Typography>
          </Localized>
          <Flex>
            <Localized id="configure-general-reaction-sortMenu-sortBy">
              <Typography
                variant="bodyCopyBold"
                container={
                  <label htmlFor="configure-general-reaction-sortMenu-sortMenu" />
                }
              >
                Sort By
              </Typography>
            </Localized>
            <SelectField>
              <Option value={settings.reaction.sortLabel}>
                {settings.reaction.sortLabel}
              </Option>{" "}
            </SelectField>
          </Flex>
        </div>
      </Flex>
    </HorizontalGutter>
  </HorizontalGutter>
);

export default ReactionsConfig;
