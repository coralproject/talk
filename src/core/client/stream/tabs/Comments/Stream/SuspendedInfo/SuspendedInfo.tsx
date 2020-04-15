import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import styles from "./SuspendedInfo.css";

interface Props {
  organization: string;
  until: string;
}

const SuspendedInfo: FunctionComponent<Props> = ({ until, organization }) => {
  const { locales } = useCoralContext();
  const untilDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locales, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    return formatter.format(new Date(until));
  }, [locales, until]);
  return (
    <CallOut
      color="negative"
      iconColor="none"
      icon={
        <Icon size="sm" className={styles.icon}>
          timer
        </Icon>
      }
      borderPosition="top"
      title={
        <Localized id="suspendInfo-heading-yourAccountHasBeen">
          Your account has been temporarily suspended from commenting
        </Localized>
      }
    >
      <Localized
        $organization={organization}
        id="suspendInfo-description-inAccordanceWith"
      >
        <div className={styles.description}>
          In accordance with {organization}'s community guidelines your account
          has been temporarily suspended. While suspended you will not be able
          to comment, respect or report comments.
        </div>
      </Localized>
      <Localized $until={untilDate} id="suspendInfo-until-pleaseRejoinThe">
        <div className={styles.until}>
          Please rejoin the conversation on {untilDate}.
        </div>
      </Localized>
    </CallOut>
  );
};

export default SuspendedInfo;
