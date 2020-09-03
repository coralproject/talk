import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

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
      void updateBio({ bio });
    },
    [updateBio]
  );
  if (!settings.memberBios) {
    return null;
  }
  return (
    <Form onSubmit={onSubmit} initialValues={{ bio: viewer.bio }}>
      {({ handleSubmit, submitting, pristine, invalid }) => (
        <form autoComplete="off" onSubmit={handleSubmit} id="bio-form">
          <HorizontalGutter>
            <Field name="bio" parse={parseEmptyAsNull}>
              {({ input, meta }) => (
                <MarkdownEditor
                  name={input.name}
                  onChange={input.onChange}
                  value={input.value}
                />
              )}
            </Field>
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
                <Button
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
