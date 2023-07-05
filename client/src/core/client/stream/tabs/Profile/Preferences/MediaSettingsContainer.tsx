import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  MutationInput,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  CheckBox,
  FieldSet,
  FormField,
  HorizontalGutter,
  HorizontalRule,
  Icon,
} from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { MediaSettingsContainer_settings } from "coral-stream/__generated__/MediaSettingsContainer_settings.graphql";
import { MediaSettingsContainer_viewer } from "coral-stream/__generated__/MediaSettingsContainer_viewer.graphql";
import { UpdateUserMediaSettingsMutation as UpdateUserMediaSettingsMutationValues } from "coral-stream/__generated__/UpdateUserMediaSettingsMutation.graphql";

import UpdateUserMediaSettingsMutation from "./UpdateUserMediaSettingsMutation";

import styles from "./MediaSettingsContainer.css";

interface Props {
  settings: MediaSettingsContainer_settings;
  viewer: MediaSettingsContainer_viewer;
}

const MediaSettingsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const updateMediaSettings = useMutation(UpdateUserMediaSettingsMutation);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const closeSuccess = useCallback(() => {
    setShowSuccess(false);
  }, [setShowSuccess]);
  const closeError = useCallback(() => {
    setShowError(false);
  }, [setShowError]);
  const onSubmit = useCallback(
    async (values: MutationInput<UpdateUserMediaSettingsMutationValues>) => {
      try {
        await updateMediaSettings(values);
        setShowSuccess(true);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        setShowError(true);
        return {
          [FORM_ERROR]: err.message,
        };
      }

      return;
    },
    [updateMediaSettings, setShowSuccess, setShowError]
  );

  if (
    !settings.media.giphy.enabled &&
    !settings.media.twitter.enabled &&
    !settings.media.youtube.enabled &&
    !settings.media.external.enabled
  ) {
    return null;
  }

  return (
    <>
      <HorizontalGutter
        container="section"
        className={CLASSES.mediaPreferences.$root}
        aria-labelledby="profile-preferences-mediaPreferences-title"
      >
        <Form initialValues={viewer.mediaSettings} onSubmit={onSubmit}>
          {({
            handleSubmit,
            submitting,
            submitError,
            pristine,
            submitSucceeded,
          }) => (
            <form className={styles.form} onSubmit={handleSubmit}>
              <Localized id="profile-preferences-mediaPreferences">
                <h2
                  className={cn(styles.title, CLASSES.mediaPreferences.heading)}
                  id="profile-preferences-mediaPreferences-title"
                >
                  Media Preferences
                </h2>
              </Localized>
              <div className={styles.options}>
                <FieldSet>
                  <FormField>
                    <Field name="unfurlEmbeds" type="checkbox">
                      {({ input }) => (
                        <CheckBox
                          {...input}
                          id={input.name}
                          variant="streamBlue"
                        >
                          <Localized id="profile-preferences-mediaPreferences-alwaysShow">
                            <div>Always show GIFs, Tweets, YouTube, etc.</div>
                          </Localized>
                        </CheckBox>
                      )}
                    </Field>
                  </FormField>
                </FieldSet>
                <Localized id="profile-preferences-mediaPreferences-thisMayMake">
                  <div className={styles.checkBoxDescription}>
                    This may make the comments slower to load
                  </div>
                </Localized>
              </div>
              <div
                className={cn(styles.updateButton, {
                  [styles.updateButtonNotification]: showSuccess || showError,
                })}
              >
                <Localized id="profile-preferences-mediaPreferences-update">
                  <Button
                    type="submit"
                    disabled={submitting || pristine}
                    className={CLASSES.mediaPreferences.updateButton}
                    upperCase
                  >
                    Update
                  </Button>
                </Localized>
              </div>
              {((submitError && showError) ||
                (submitSucceeded && showSuccess)) && (
                <div className={styles.callOut}>
                  {submitError && showError && (
                    <CallOut
                      color="error"
                      onClose={closeError}
                      icon={<Icon size="sm">warning</Icon>}
                      titleWeight="semiBold"
                      title={<span>{submitError}</span>}
                      role="alert"
                    />
                  )}
                  {submitSucceeded && showSuccess && (
                    <CallOut
                      color="success"
                      onClose={closeSuccess}
                      icon={<Icon size="sm">check_circle</Icon>}
                      titleWeight="semiBold"
                      title={
                        <Localized id="profile-preferences-mediaPreferences-preferencesUpdated">
                          <span>Your media preferences have been updated</span>
                        </Localized>
                      }
                      aria-live="polite"
                    />
                  )}
                </div>
              )}
            </form>
          )}
        </Form>
      </HorizontalGutter>
      <HorizontalRule />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment MediaSettingsContainer_settings on Settings {
      media {
        giphy {
          enabled
        }
        twitter {
          enabled
        }
        youtube {
          enabled
        }
        external {
          enabled
        }
      }
    }
  `,
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
