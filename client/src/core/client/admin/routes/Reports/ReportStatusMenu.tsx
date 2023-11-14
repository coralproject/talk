import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { useMutation } from "coral-framework/lib/relay";
import { GQLDSAReportStatus } from "coral-framework/schema";
import {
  ArrowsDownIcon,
  ArrowsUpIcon,
  ButtonSvgIcon,
  SignBadgeCircleDuoIcon,
  SignBadgeCircleIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import {
  Button,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Flex,
  Popover,
} from "coral-ui/components/v2";

import { DSAReportStatus } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./ReportStatusMenu.css";

import ChangeReportStatusMutation from "./ChangeReportStatusMutation";

interface Props {
  value: DSAReportStatus | null;
  reportID: string;
  userID?: string;
  onChangeReportStatusCompleted: () => void;
}

const ReportStatusMenu: FunctionComponent<Props> = ({
  value,
  reportID,
  userID,
  onChangeReportStatusCompleted,
}) => {
  const changeReportStatus = useMutation(ChangeReportStatusMutation);
  const { localeBundles } = useCoralContext();

  const statusMappings = {
    AWAITING_REVIEW: {
      text: getMessage(
        localeBundles,
        "reports-status-awaitingReview",
        "Awaiting review"
      ),
      icon: (
        <SvgIcon Icon={SignBadgeCircleIcon} color="teal" filled="tealLight" />
      ),
    },
    UNDER_REVIEW: {
      text: getMessage(localeBundles, "reports-status-inReview", "In review"),
      icon: (
        <SvgIcon
          Icon={SignBadgeCircleDuoIcon}
          filled="tealLight"
          color="teal"
        />
      ),
    },
    COMPLETED: {
      text: getMessage(localeBundles, "reports-status-completed", "Completed"),
      icon: (
        <SvgIcon
          Icon={SignBadgeCircleIcon}
          filled="currentColor"
          color="teal"
        />
      ),
    },
    VOID: {
      text: getMessage(localeBundles, "reports-status-void", "Void"),
      icon: (
        <SvgIcon
          Icon={SignBadgeCircleIcon}
          filled="currentColor"
          color="teal"
        />
      ),
    },
    "%future added value": {
      text: getMessage(
        localeBundles,
        "reports-status-unknown",
        "Unknown status"
      ),
      icon: (
        <SvgIcon Icon={SignBadgeCircleIcon} color="teal" filled="tealLight" />
      ),
    },
  };

  const onChangeStatus = useCallback(
    async (status: GQLDSAReportStatus) => {
      if (status === "COMPLETED") {
        onChangeReportStatusCompleted();
      } else {
        if (userID) {
          await changeReportStatus({
            reportID,
            userID,
            status,
          });
        }
      }
    },
    [reportID, userID, changeReportStatus, onChangeReportStatusCompleted]
  );
  return (
    <>
      <label
        className={styles.statusLabel}
        htmlFor="coral-reports-report-statusMenu"
      >
        Status
      </label>
      <Popover
        id=""
        placement="bottom-end"
        modifiers={{ arrow: { enabled: false }, offset: { offset: "0, 4" } }}
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <IntersectionProvider>
              <Dropdown className={styles.dropdown}>
                <Localized id="reports-status-awaitingReview">
                  <DropdownButton
                    className={styles.dropdownButton}
                    onClick={async () => {
                      toggleVisibility();
                      await onChangeStatus(GQLDSAReportStatus.AWAITING_REVIEW);
                    }}
                    icon={
                      statusMappings[GQLDSAReportStatus.AWAITING_REVIEW].icon
                    }
                  >
                    Awaiting Review
                  </DropdownButton>
                </Localized>
                <Localized id="reports-status-inReview">
                  <DropdownButton
                    className={styles.dropdownButton}
                    onClick={async () => {
                      toggleVisibility();
                      await onChangeStatus(GQLDSAReportStatus.UNDER_REVIEW);
                    }}
                    icon={statusMappings[GQLDSAReportStatus.UNDER_REVIEW].icon}
                  >
                    In review
                  </DropdownButton>
                </Localized>
                <Localized id="reports-status-completed">
                  <DropdownButton
                    className={styles.dropdownButton}
                    onClick={async () => {
                      toggleVisibility();
                      await onChangeStatus(GQLDSAReportStatus.COMPLETED);
                    }}
                    icon={statusMappings[GQLDSAReportStatus.COMPLETED].icon}
                  >
                    Completed
                  </DropdownButton>
                </Localized>
              </Dropdown>
            </IntersectionProvider>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref, visible }) => (
          <Button
            className={styles.toggleButton}
            variant="outlined"
            adornmentLeft
            color="mono"
            onClick={toggleVisibility}
            ref={ref}
            uppercase={false}
            disabled={
              value === GQLDSAReportStatus.COMPLETED ||
              value === GQLDSAReportStatus.VOID
            }
          >
            {value
              ? statusMappings[value].icon
              : statusMappings[GQLDSAReportStatus.AWAITING_REVIEW].icon}
            <Flex alignItems="center">
              {value
                ? statusMappings[value].text
                : statusMappings[GQLDSAReportStatus.AWAITING_REVIEW].text}
            </Flex>
            {!visible && <ButtonSvgIcon Icon={ArrowsDownIcon} size="xs" />}
            {visible && <ButtonSvgIcon Icon={ArrowsUpIcon} size="xs" />}
          </Button>
        )}
      </Popover>
    </>
  );
};

export default ReportStatusMenu;
