import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  CheckBox,
  FieldSet,
  FormField,
  HorizontalGutter,
} from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { EmbedPreferencesContainer_viewer } from "coral-stream/__generated__/EmbedPreferencesContainer_viewer.graphql";

import UpdateEmbedPreferencesMutation from "./UpdateEmbedPreferencesMutation";

import styles from "./EmbedPreferencesContainer.css";

interface Props {
  viewer: EmbedPreferencesContainer_viewer;
}

const EmbedPreferencesContainer: FunctionComponent<Props> = ({ viewer }) => {
  const updatePreferences = useMutation(UpdateEmbedPreferencesMutation);

  const onSubmit = useCallback(
    async (e) => {
      try {
        await updatePreferences(e);
      } catch (err) {
        window.console.log(err);
      }
    },
    [updatePreferences]
  );

  return (
    <HorizontalGutter>
      <Form initialValues={viewer.embedPreferences} onSubmit={onSubmit}>
        {({ submitting, pristine, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Localized id="profile-preferences-mediaPreferences">
              <div className={styles.title}>Media Preferences</div>
            </Localized>
            <div className={styles.options}>
              <FieldSet>
                <FormField>
                  <Field name="unfurlEmbeds" type="checkbox">
                    {({ input }) => (
                      <CheckBox {...input} id={input.name} variant="streamBlue">
                        <Localized id="profile-preferences-alwaysShowMedia">
                          Always show media
                        </Localized>
                      </CheckBox>
                    )}
                  </Field>
                </FormField>
              </FieldSet>
            </div>
            <Button type="submit" disabled={submitting || pristine} upperCase>
              Update
            </Button>
          </form>
        )}
      </Form>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment EmbedPreferencesContainer_viewer on User {
      id
      embedPreferences {
        unfurlEmbeds
      }
    }
  `,
})(EmbedPreferencesContainer);

export default enhanced;
