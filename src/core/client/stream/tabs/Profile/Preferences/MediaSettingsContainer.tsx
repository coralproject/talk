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

import { MediaSettingsContainer_viewer } from "coral-stream/__generated__/MediaSettingsContainer_viewer.graphql";

import UpdateUserMediaSettingsMutation from "./UpdateUserMediaSettingsMutation";

import styles from "./MediaSettingsContainer.css";

interface Props {
  viewer: MediaSettingsContainer_viewer;
}

const MediaSettingsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const updateMediaSettings = useMutation(UpdateUserMediaSettingsMutation);

  const onSubmit = useCallback(
    async (e) => {
      try {
        await updateMediaSettings(e);
      } catch (err) {
        window.console.log(err);
      }
    },
    [updateMediaSettings]
  );

  return (
    <HorizontalGutter>
      <Form initialValues={viewer.mediaSettings} onSubmit={onSubmit}>
        {({ submitting, pristine, handleSubmit }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <Localized id="profile-preferences-mediaPreferences">
              <div className={styles.title}>Media Preferences</div>
            </Localized>
            <div className={styles.options}>
              <FieldSet>
                <FormField>
                  <Field name="unfurlEmbeds" type="checkbox">
                    {({ input }) => (
                      <CheckBox {...input} id={input.name} variant="streamBlue">
                        <Localized id="profile-preferences-alwaysShow">
                          <div>Always show GIFs, Tweets, YouTube, etc.</div>
                        </Localized>
                      </CheckBox>
                    )}
                  </Field>
                </FormField>
              </FieldSet>
              <Localized id="profile-preferences-thisMayMake">
                <div className={styles.checkBoxDescription}>
                  This may make the comments slower to load
                </div>
              </Localized>
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
    fragment MediaSettingsContainer_viewer on User {
      id
      mediaSettings {
        unfurlEmbeds
      }
    }
  `,
})(MediaSettingsContainer);

export default enhanced;
