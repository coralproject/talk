import { Localized } from "@fluent/react/compat";
import { useRouter } from "found";
import key from "keymaster";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useMemo } from "react";

import { HOTKEYS } from "coral-admin/constants";
import { SectionFilter } from "coral-common/section";
import { getModerationLink } from "coral-framework/helpers";
import { Counter, Icon, SubBarNavigation } from "coral-ui/components/v2";

import NavigationLink from "./NavigationLink";

interface Props {
  unmoderatedCount?: number | null;
  reportedCount?: number | null;
  pendingCount?: number | null;
  storyID?: string | null;
  siteID?: string | null;
  section?: SectionFilter | null;
  mode?: "PRE" | "POST" | "SPECIFIC_SITES_PRE" | "%future added value" | null;
  enableForReview?: boolean;
}

const Navigation: FunctionComponent<Props> = ({
  unmoderatedCount,
  reportedCount,
  pendingCount,
  storyID,
  siteID,
  section,
  mode,
  enableForReview,
}) => {
  const { match, router } = useRouter();
  const moderationLinks = useMemo(() => {
    return [
      getModerationLink({ queue: "reported", storyID, siteID, section }),
      getModerationLink({ queue: "pending", storyID, siteID, section }),
      getModerationLink({ queue: "unmoderated", storyID, siteID, section }),
      getModerationLink({ queue: "approved", storyID, siteID, section }),
      getModerationLink({ queue: "rejected", storyID, siteID, section }),
      getModerationLink({ queue: "review", storyID, siteID, section }),
    ];
  }, [storyID, siteID, section]);

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
  }, [match, moderationLinks, router]);

  return (
    <SubBarNavigation>
      {(mode === "POST" || (isNumber(reportedCount) && reportedCount > 0)) && (
        <NavigationLink to={moderationLinks[0]}>
          <Icon>flag</Icon>
          <Localized id="moderate-navigation-reported">
            <span>Reported</span>
          </Localized>
          {isNumber(reportedCount) && (
            <Counter data-testid="moderate-navigation-reported-count">
              <Localized
                id="moderate-navigation-comment-count"
                vars={{ count: reportedCount }}
              >
                {reportedCount}
              </Localized>
            </Counter>
          )}
        </NavigationLink>
      )}
      <NavigationLink to={moderationLinks[1]}>
        <Icon>access_time</Icon>
        <Localized id="moderate-navigation-pending">
          <span>Pending</span>
        </Localized>
        {isNumber(pendingCount) && (
          <Counter data-testid="moderate-navigation-pending-count">
            <Localized
              id="moderate-navigation-comment-count"
              vars={{ count: pendingCount }}
            >
              {pendingCount}
            </Localized>
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
            <Localized
              id="moderate-navigation-comment-count"
              vars={{ count: unmoderatedCount }}
            >
              {unmoderatedCount}
            </Localized>
          </Counter>
        )}
      </NavigationLink>
      <NavigationLink to={moderationLinks[3]}>
        <Icon>check_circle</Icon>
        <Localized id="moderate-navigation-approved">
          <span>Approved</span>
        </Localized>
      </NavigationLink>
      <NavigationLink to={moderationLinks[4]}>
        <Icon>cancel</Icon>
        <Localized id="moderate-navigation-rejected">
          <span>Rejected</span>
        </Localized>
      </NavigationLink>
      {enableForReview && (
        <NavigationLink to={moderationLinks[5]}>
          <Icon>done_all</Icon>
          <Localized id="moderate-navigation-forReview">
            <span>For Review</span>
          </Localized>
        </NavigationLink>
      )}
    </SubBarNavigation>
  );
};

export default Navigation;
