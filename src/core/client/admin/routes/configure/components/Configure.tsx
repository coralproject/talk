import { FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Form, FormSpy } from "react-final-form";

import { Button, HorizontalGutter } from "talk-ui/components";
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
  <Form onSubmit={onSave}>
    {({ handleSubmit, submitting, pristine, form }) => (
      <form autoComplete="off" onSubmit={handleSubmit}>
        <FormSpy onChange={onChange} />
        <Layout>
          <SideBar>
            <HorizontalGutter size="double">
              <Navigation>
                <Localized id="configure-sideBarNavigation-auth">
                  <Link to="/admin/configure/auth">Auth</Link>
                </Localized>
                <Link to="/admin/configure/misc">Misc</Link>
              </Navigation>
            </HorizontalGutter>
            <Localized id="configure-sideBar-saveChanges">
              <Button
                color="success"
                variant="filled"
                type="submit"
                disabled={submitting || pristine}
              >
                Save Changes
              </Button>
            </Localized>
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
);

export default Configure;
