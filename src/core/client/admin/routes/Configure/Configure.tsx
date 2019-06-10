import { FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Form, FormSpy } from "react-final-form";

import MainLayout from "coral-admin/components/MainLayout";
import { Button, CallOut, HorizontalGutter } from "coral-ui/components";

import Layout from "./Layout";
import Link from "./Link";
import Main from "./Main";
import Navigation from "./Navigation";
import SideBar from "./SideBar";

interface Props {
  onSubmit: (settings: any, form: FormApi) => void;
  onChange: (formState: FormState) => void;
  children: React.ReactElement;
}

const Configure: FunctionComponent<Props> = ({
  onSubmit,
  onChange,
  children,
}) => (
  <MainLayout data-testid="configure-container">
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, submitting, pristine, form, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit} id="configure-form">
          <FormSpy onChange={onChange} />
          <Layout>
            <SideBar>
              <HorizontalGutter size="double">
                <Navigation>
                  <Localized id="configure-sideBarNavigation-general">
                    <Link to="/admin/configure/general">General</Link>
                  </Localized>
                  <Localized id="configure-sideBarNavigation-organization">
                    <Link to="/admin/configure/organization">Organization</Link>
                  </Localized>
                  <Localized id="configure-sideBarNavigation-moderation">
                    <Link to="/admin/configure/moderation">Moderation</Link>
                  </Localized>
                  <Localized id="configure-sideBarNavigation-bannedAndSuspectWords">
                    <Link to="/admin/configure/wordList">
                      Banned and Suspect Words
                    </Link>
                  </Localized>
                  <Localized id="configure-sideBarNavigation-authentication">
                    <Link to="/admin/configure/auth">Authentication</Link>
                  </Localized>
                  <Localized id="configure-sideBarNavigation-advanced">
                    <Link to="/admin/configure/advanced">Advanced</Link>
                  </Localized>
                </Navigation>
              </HorizontalGutter>
              <HorizontalGutter size="double">
                <Localized id="configure-sideBar-saveChanges">
                  <Button
                    data-testid="configure-sideBar-saveChanges"
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
