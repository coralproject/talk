import { Localized } from "@fluent/react/compat";
import { FormApi, FormState } from "final-form";
import arrayMutators from "final-form-arrays";
import React, { FunctionComponent } from "react";
import { Form, FormSpy } from "react-final-form";

import MainLayout from "coral-admin/components/MainLayout";
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

const Configure: FunctionComponent<Props> = ({
  onSubmit,
  onChange,
  children,
}) => (
  <MainLayout data-testid="configure-container">
    <Form onSubmit={onSubmit} mutators={{ ...arrayMutators }}>
      {({ handleSubmit, submitting, form, pristine, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit} id="configure-form">
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

export default Configure;
