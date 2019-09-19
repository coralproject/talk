import { HOTKEYS } from "coral-admin/constants";
import { Localized } from "fluent-react/compat";
import { useRouter } from "found";
import key from "keymaster";
import React, { FunctionComponent, useEffect, useMemo } from "react";

import { getModerationLink } from "coral-admin/helpers";
import { Counter, Icon, SubBarNavigation } from "coral-ui/components";

import NavigationLink from "./NavigationLink";

interface Props {
  unmoderatedCount?: number;
  reportedCount?: number;
  pendingCount?: number;
  storyID?: string | null;
}

const Navigation: FunctionComponent<Props> = ({
  unmoderatedCount,
  reportedCount,
  pendingCount,
  storyID,
}) => {
  const { match, router } = useRouter();

  const moderationLinks = useMemo(() => {
    return [
      getModerationLink("reported", storyID),
      getModerationLink("pending", storyID),
      getModerationLink("unmoderated", storyID),
      getModerationLink("rejected", storyID),
    ];
  }, [storyID]);

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
    };
  }, [match]);

  return (
    <SubBarNavigation>
      <NavigationLink to={moderationLinks[0]}>
        <Icon>flag</Icon>
        <Localized id="moderate-navigation-reported">
          <span>Reported</span>
        </Localized>
        {reportedCount !== undefined && (
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
        {pendingCount !== undefined && (
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
        {unmoderatedCount !== undefined && (
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

export default Navigation;
