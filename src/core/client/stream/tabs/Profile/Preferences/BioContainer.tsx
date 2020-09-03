import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { MAX_BIO_LENGTH } from "coral-common/constants";
import { MarkdownEditor } from "coral-framework/components/loadables";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { validateMaxLength } from "coral-framework/lib/validation";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import { BioContainer_settings } from "coral-stream/__generated__/BioContainer_settings.graphql";
import { BioContainer_viewer } from "coral-stream/__generated__/BioContainer_viewer.graphql";

import UpdateBioMutation from "./UpdateBioMutation";

interface Props {
  viewer: BioContainer_viewer;
  settings: BioContainer_settings;
}

const BioContainer: FunctionComponent<Props> = ({ viewer, settings }) => {
  const updateBio = useMutation(UpdateBioMutation);
  const onRemoveBio = useCallback(() => {
    void updateBio({ bio: null });
  }, [updateBio]);
  const onSubmit = useCallback(
    (formData: any) => {
      const { bio } = formData;
      try {
        void updateBio({ bio });
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
    <Form onSubmit={onSubmit} initialValues={{ bio: viewer.bio }}>
      {({
        handleSubmit,
        submitting,
        pristine,
        invalid,
        submitError,
        error,
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
                  <MarkdownEditor
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                  />
                  <div>
                    {meta.error && (
                      <ValidationMessage
                        meta={meta}
                        justifyContent="flex-end"
                      />
                    )}
                    <Localized
                      id="profile-bio-maxCharacters"
                      $maxCharacters={100}
                    >
                      <div>Max. 100 Characters</div>
                    </Localized>
                  </div>
                </>
              )}
            </Field>

            {submitError && <CallOut color="error">{submitError}</CallOut>}
            <Flex itemGutter>
              <Localized id="profile-bio-remove">
                <Button
                  color="secondary"
                  type="button"
                  onClick={onRemoveBio}
                  disabled={submitting || !viewer.bio}
                >
                  Remove
                </Button>
              </Localized>
              <Localized id="profile-bio-update">
                <Button type="submit" disabled={submitting || pristine}>
                  Update
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
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
