import { Localized } from "@fluent/react/compat";
import { FormApi, FormState, Mutator } from "final-form";
import arrayMutators from "final-form-arrays";
import React, { FunctionComponent, useCallback } from "react";
import { Form, FormSpy } from "react-final-form";

import MainLayout from "coral-admin/components/MainLayout";
import {
  GQLMODERATION_MODE,
  GQLNewCommentersConfiguration,
} from "coral-framework/schema";
import { Button, CallOut, HorizontalGutter } from "coral-ui/components/v2";

import ConfigureLinks from "./ConfigureLinks";
import Layout from "./Layout";
import Main from "./Main";
import SideBar from "./SideBar";

interface Props {
  onSubmit: (settings: any, form: FormApi) => void;
  onChange: (formState: FormState<any>) => void;
  children: React.ReactElement;
}

interface FormStateValues {
  moderation: GQLMODERATION_MODE;
  newCommenters: GQLNewCommentersConfiguration;
  premoderateAllCommentsSites: string[];
}

const Configure: FunctionComponent<Props> = ({
  onSubmit,
  onChange,
  children,
}) => {
  const cleanData: Mutator = useCallback((_, state, { changeValue }) => {
    if (state.lastFormState) {
      const { moderation, newCommenters, premoderateAllCommentsSites } = state
        .lastFormState.values as FormStateValues;
      // This ensures sites aren't saved to premoderateAllCommentsSites
      // if the SPECIFIC_SITES_PRE moderation mode isn't selected
      if (
        moderation &&
        moderation !== GQLMODERATION_MODE.SPECIFIC_SITES_PRE &&
        premoderateAllCommentsSites
      ) {
        changeValue(state, "premoderateAllCommentsSites", () => []);
      }
      // This ensures sites aren't saved to premodSites for newCommenters
      // if the SPECIFIC_SITES_PRE moderation mode isn't selected
      if (
        newCommenters &&
        newCommenters.moderation &&
        newCommenters.moderation.mode &&
        newCommenters.moderation.mode !==
          GQLMODERATION_MODE.SPECIFIC_SITES_PRE &&
        newCommenters.moderation.premodSites
      ) {
        changeValue(state, "newCommenters.moderation.premodSites", () => []);
      }
    }
  }, []);
  return (
    <MainLayout data-testid="configure-container">
      <Form onSubmit={onSubmit} mutators={{ ...arrayMutators, cleanData }}>
        {({ handleSubmit, submitting, form, pristine, submitError }) => (
          <form
            autoComplete="off"
            onSubmit={async (e) => {
              e.preventDefault();
              form.mutators.cleanData();
              await handleSubmit(e);
            }}
            id="configure-form"
          >
            <FormSpy onChange={onChange} />
            <Layout>
              <SideBar>
                <HorizontalGutter size="double">
                  <ConfigureLinks />
                </HorizontalGutter>
                <HorizontalGutter size="double">
                  <Localized id="configure-sideBar-saveChanges">
                    <Button
                      data-testid="configure-sideBar-saveChanges"
                      type="submit"
                      color="alt"
                      size="large"
                      disabled={submitting || pristine}
                    >
                      Save Changes
                    </Button>
                  </Localized>
                  {submitError && (
                    <CallOut
                      color="error"
                      fullWidth
                      data-testid="configure-auth-submitError"
                    >
                      {submitError}
                    </CallOut>
                  )}
                </HorizontalGutter>
              </SideBar>
              <Main>
                {React.cloneElement(React.Children.only(children), {
                  form,
                  submitting,
                })}
              </Main>
            </Layout>
          </form>
        )}
      </Form>
    </MainLayout>
  );
};

export default Configure;
