import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { ReactionConfigContainer_settings as SettingsData } from "coral-admin/__generated__/ReactionConfigContainer_settings.graphql";
import { required } from "coral-framework/lib/validation";
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
      <Typography variant="bodyCopy">
        Allow your community to engage with one another and express themselves
        with one-click reactions. By default, Coral allows commenters to
        "Respect" each other's comments, but you may customize reaction text
        based on the needs of your community.
      </Typography>
    </Localized>
    <HorizontalGutter size="double">
      <FormField>
        <Field name="reaction.label" validate={required}>
          {({ input, meta }) => (
            <Flex itemGutter="double">
              <HorizontalGutter>
                <Localized id="configure-general-reactions-label">
                  <InputLabel>Reaction label</InputLabel>
                </Localized>
                <Localized id="configure-general-reactions-input">
                  <TextField
                    className={styles.textInput}
                    id={input.name}
                    type="text"
                    fullWidth
                    placeholder="E.g. Respect"
                    disabled={disabled}
                    {...input}
                  />
                </Localized>
                <ValidationMessage fullWidth meta={meta} />
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="configure-general-reactions-preview">
                  <Typography variant="heading3">Preview</Typography>
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
      </FormField>
      <FormField>
        <Field name="reaction.labelActive" validate={required}>
          {({ input, meta }) => (
            <Flex itemGutter="double">
              <HorizontalGutter>
                <Localized id="configure-general-reactions-active-label">
                  <InputLabel>Active reaction label</InputLabel>
                </Localized>
                <Localized id="configure-general-reactions-active-input">
                  <TextField
                    className={styles.textInput}
                    id={input.name}
                    type="text"
                    placeholder="E.g. Respected"
                    fullWidth
                    disabled={disabled}
                    {...input}
                  />
                </Localized>
                <ValidationMessage fullWidth meta={meta} />
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="configure-general-reactions-preview">
                  <Typography variant="heading3">Preview</Typography>
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
      </FormField>
      <FormField>
        <Field name="reaction.sortLabel" validate={required}>
          {({ input, meta }) => (
            <Flex itemGutter="double">
              <HorizontalGutter>
                <Localized id="configure-general-reactions-sort-label">
                  <InputLabel>Sort label</InputLabel>
                </Localized>
                <Localized id="configure-general-reactions-sort-input">
                  <TextField
                    id={input.name}
                    className={styles.textInput}
                    type="text"
                    placeholder="E.g. Most respected"
                    fullWidth
                    disabled={disabled}
                    {...input}
                  />
                </Localized>
                <ValidationMessage fullWidth meta={meta} />
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="configure-general-reactions-preview">
                  <Typography variant="heading3">Preview</Typography>
                </Localized>
                <Flex justifyContent="center" alignItems="center" itemGutter>
                  <Localized id="configure-general-reaction-sortMenu-sortBy">
                    <Typography variant="bodyCopyBold">Sort By</Typography>
                  </Localized>
                  <SelectField>
                    <Option value={input.value}>{input.value}</Option>{" "}
                  </SelectField>
                </Flex>
              </HorizontalGutter>
            </Flex>
          )}
        </Field>
      </FormField>
    </HorizontalGutter>
  </HorizontalGutter>
);

export default ReactionsConfig;
