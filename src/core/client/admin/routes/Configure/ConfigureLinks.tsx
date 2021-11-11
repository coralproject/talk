import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import Link from "./Link";
import Navigation from "./Navigation";
import SubLink from "./Sublink";

const ConfigureLinks: FunctionComponent<{}> = () => {
  return (
    <Navigation>
      <Localized id="configure-sideBarNavigation-general">
        <Link to="/admin/configure/general">General</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-organization">
        <Link to="/admin/configure/organization">Organization</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-moderation">
        <Link exact to="/admin/configure/moderation">
          Moderation
        </Link>
      </Localized>
      {/* knote: actually add id */}
      <Localized id="configure-sideBarNavigation-moderation-comments">
        <Link
          exact
          to={{ pathname: "/admin/configure/moderation", hash: "#comments" }}
        >
          {(href: {
            onClick: (e: React.SyntheticEvent<Element, Event>) => void;
          }) => {
            return (
              <SubLink onClick={href.onClick} anchorLink="#comments">
                Comments
              </SubLink>
            );
          }}
        </Link>
      </Localized>
      {/* knote: actually add id */}
      <Localized id="configure-sideBarNavigation-moderation-users">
        <Link
          exact
          to={{ pathname: "/admin/configure/moderation", hash: "#users" }}
        >
          {(href: {
            onClick: (e: React.SyntheticEvent<Element, Event>) => void;
          }) => {
            return (
              <SubLink onClick={href.onClick} anchorLink="#users">
                Users
              </SubLink>
            );
          }}
        </Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-moderationPhases">
        <Link to="/admin/configure/moderation/phases">Moderation Phases</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-bannedAndSuspectWords">
        <Link to="/admin/configure/wordList">Banned and Suspect Words</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-authentication">
        <Link to="/admin/configure/auth">Authentication</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-email">
        <Link to="/admin/configure/email">Email</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-slack">
        <Link to="/admin/configure/slack">Slack</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-webhooks">
        <Link to="/admin/configure/webhooks">Webhooks</Link>
      </Localized>
      <Localized id="configure-sideBarNavigation-advanced">
        <Link to="/admin/configure/advanced">Advanced</Link>
      </Localized>
    </Navigation>
  );
};

export default ConfigureLinks;
