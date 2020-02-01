import { Localized } from "@fluent/react/compat";
import { Match, Router, withRouter } from "found";
import key from "keymaster";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useMemo } from "react";

import { HOTKEYS } from "coral-admin/constants";
import { getModerationLink } from "coral-framework/helpers";
import { Counter, Icon, SubBarNavigation } from "coral-ui/components/v2";

import NavigationLink from "./NavigationLink";

interface Props {
  unmoderatedCount?: number | null;
  reportedCount?: number | null;
  pendingCount?: number | null;
  storyID?: string | null;
  siteID?: string | null;
  router: Router;
  match: Match;
}

const Navigation: FunctionComponent<Props> = ({
  unmoderatedCount,
  reportedCount,
  pendingCount,
  storyID,
  siteID,
  router,
  match,
}) => {
  const moderationLinks = useMemo(() => {
    return [
      getModerationLink({ queue: "reported", storyID, siteID }),
      getModerationLink({ queue: "pending", storyID, siteID }),
      getModerationLink({ queue: "unmoderated", storyID, siteID }),
      getModerationLink({ queue: "rejected", storyID, siteID }),
    ];
  }, [storyID, siteID]);

  useEffect(() => {
    key(HOTKEYS.SWITCH_QUEUE, () => {
      const current = match.location.pathname;
      const index = moderationLinks.indexOf(current);
      if (index >= 0) {
        if (index === moderationLinks.length - 1) {
          router.replace(moderationLinks[0]);
        } else {
          router.replace(moderationLinks[index + 1]);
        }
      }
    });
    for (let i = 0; i < moderationLinks.length; i++) {
      key(`${i + 1}`, () => {
        router.replace(moderationLinks[i]);
      });
    }
    return () => {
      key.unbind(HOTKEYS.SWITCH_QUEUE);
      for (let i = 0; i < moderationLinks.length; i++) {
        key.unbind(`${i + 1}`);
      }
    };
  }, [match, moderationLinks]);

  return (
    <SubBarNavigation>
      <NavigationLink to={moderationLinks[0]}>
        <Icon>flag</Icon>
        <Localized id="moderate-navigation-reported">
          <span>Reported</span>
        </Localized>
        {isNumber(reportedCount) && (
          <Counter data-testid="moderate-navigation-reported-count">
            {reportedCount}
          </Counter>
        )}
      </NavigationLink>
      <NavigationLink to={moderationLinks[1]}>
        <Icon>access_time</Icon>
        <Localized id="moderate-navigation-pending">
          <span>Pending</span>
        </Localized>
        {isNumber(pendingCount) && (
          <Counter data-testid="moderate-navigation-pending-count">
            {pendingCount}
          </Counter>
        )}
      </NavigationLink>
      <NavigationLink to={moderationLinks[2]}>
        <Icon>forum</Icon>
        <Localized id="moderate-navigation-unmoderated">
          <span>Unmoderated</span>
        </Localized>
        {isNumber(unmoderatedCount) && (
          <Counter data-testid="moderate-navigation-unmoderated-count">
            {unmoderatedCount}
          </Counter>
        )}
      </NavigationLink>
      <NavigationLink to={moderationLinks[3]}>
        <Icon>cancel</Icon>
        <Localized id="moderate-navigation-rejected">
          <span>Rejected</span>
        </Localized>
      </NavigationLink>
    </SubBarNavigation>
  );
};

export default withRouter(Navigation);
