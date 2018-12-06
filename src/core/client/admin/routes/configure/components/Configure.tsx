import { FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Form, FormSpy } from "react-final-form";

import MainLayout from "talk-admin/components/MainLayout";
import { Button, CallOut, HorizontalGutter } from "talk-ui/components";

import Layout from "./Layout";
import Main from "./Main";
import { Link, Navigation } from "./Navigation";
import SideBar from "./SideBar";

interface Props {
  onSave: (settings: any, form: FormApi) => void;
  onChange: (formState: FormState) => void;
}

const Configure: StatelessComponent<Props> = ({
  onSave,
  onChange,
  children,
}) => (
  <MainLayout data-test="configure-container">
    <Form onSubmit={onSave}>
      {({ handleSubmit, submitting, pristine, form, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit} id="configure-form">
          <FormSpy onChange={onChange} />
          <Layout>
            <SideBar>
              <HorizontalGutter size="double">
                <Navigation>
                  <Link to="/admin/configure/moderation">Moderation</Link>
                  <Localized id="configure-sideBarNavigation-authentication">
                    <Link to="/admin/configure/auth">Auth</Link>
                  </Localized>
                </Navigation>
              </HorizontalGutter>
              <HorizontalGutter size="double">
                <Localized id="configure-sideBar-saveChanges">
                  <Button
                    data-test="configure-sideBar-saveChanges"
                    color="success"
                    variant="filled"
                    type="submit"
                    disabled={submitting || pristine}
                  >
                    Save Changes
                  </Button>
                </Localized>
                {submitError && (
                  <CallOut
                    color="error"
                    fullWidth
                    data-test="configure-auth-submitError"
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
