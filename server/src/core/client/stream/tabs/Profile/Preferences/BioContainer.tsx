import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import CLASSES from "coral-stream/classes";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { MAX_BIO_LENGTH } from "coral-common/constants";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { validateMaxLength } from "coral-framework/lib/validation";
import {
  Flex,
  HorizontalGutter,
  HorizontalRule,
  Icon,
} from "coral-ui/components/v2";
import {
  Button,
  CallOut,
  TextArea,
  ValidationMessage,
} from "coral-ui/components/v3";

import { BioContainer_settings } from "coral-stream/__generated__/BioContainer_settings.graphql";
import { BioContainer_viewer } from "coral-stream/__generated__/BioContainer_viewer.graphql";

import RemainingCharactersContainer from "../../Comments/RemainingCharacters";
import UpdateBioMutation from "./UpdateBioMutation";

import styles from "./BioContainer.css";

interface Props {
  viewer: BioContainer_viewer;
  settings: BioContainer_settings;
}

const BioContainer: FunctionComponent<Props> = ({ viewer, settings }) => {
  const updateBio = useMutation(UpdateBioMutation);
  const onRemoveBio = useCallback(() => {
    void updateBio({ bio: null });
    setRemoved(true);
  }, [updateBio]);
  const [removed, setRemoved] = useState(false);
  const onSubmit = useCallback(
    async (formData: any) => {
      const { bio } = formData;
      try {
        await updateBio({ bio });
        return;
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [updateBio]
  );
  if (!settings.memberBios) {
    return null;
  }
  return (
    <HorizontalGutter
      container="section"
      aria-labelledby="profile-bio-title"
      className={CLASSES.myBio.$root}
    >
      <HorizontalGutter spacing={1}>
        <Localized id="profile-bio-title">
          <h2
            className={cn(styles.title, CLASSES.myBio.heading)}
            id="profile-bio-title"
          >
            Bio
          </h2>
        </Localized>
        <Localized id="profile-bio-description">
          <p className={styles.description}>
            Write a bio to display publicly on your commenting profile. Must be
            less than 100 characters.
          </p>
        </Localized>
      </HorizontalGutter>
      <Form onSubmit={onSubmit} initialValues={{ bio: viewer.bio }}>
        {({
          handleSubmit,
          submitting,
          pristine,
          invalid,
          submitError,
          submitSucceeded,
        }) => (
          <form autoComplete="off" onSubmit={handleSubmit} id="bio-form">
            <HorizontalGutter>
              <Field
                name="bio"
                parse={parseEmptyAsNull}
                validate={validateMaxLength(MAX_BIO_LENGTH)}
              >
                {({ input, meta }) => (
                  <>
                    <TextArea
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      color="streamBlue"
                    />
                    <div>
                      {meta.error && (
                        <ValidationMessage
                          meta={meta}
                          justifyContent="flex-end"
                        />
                      )}
                      <RemainingCharactersContainer
                        max={MAX_BIO_LENGTH}
                        value={input.value}
                      />
                    </div>
                  </>
                )}
              </Field>

              {removed && (
                <CallOut
                  color="success"
                  icon={<Icon size="sm">check_circle</Icon>}
                  title={
                    <Localized id="profile-bio-removed">
                      Your bio has been removed
                    </Localized>
                  }
                  aria-live="polite"
                />
              )}
              {submitSucceeded && (
                <CallOut
                  color="success"
                  icon={<Icon size="sm">check_circle</Icon>}
                  title={
                    <Localized id="profile-bio-success">
                      Your bio has been updated
                    </Localized>
                  }
                  aria-live="polite"
                />
              )}
              {submitError && (
                <CallOut color="error" role="alert">
                  {submitError}
                </CallOut>
              )}
              <Flex itemGutter className={styles.buttons}>
                <Localized id="profile-bio-remove">
                  <Button
                    upperCase
                    color="error"
                    variant="outlined"
                    type="button"
                    onClick={onRemoveBio}
                    disabled={submitting || !viewer.bio}
                  >
                    Remove
                  </Button>
                </Localized>
                <Localized id="profile-bio-update">
                  <Button
                    upperCase
                    type="submit"
                    disabled={submitting || invalid || pristine}
                  >
                    Update
                  </Button>
                </Localized>
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
      <HorizontalRule />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment BioContainer_viewer on User {
      bio
    }
  `,
  settings: graphql`
    fragment BioContainer_settings on Settings {
      memberBios
    }
  `,
})(BioContainer);

export default enhanced;
