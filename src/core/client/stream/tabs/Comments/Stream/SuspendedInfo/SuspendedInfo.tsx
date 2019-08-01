import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import { CallOut, HorizontalGutter, Typography } from "coral-ui/components";

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
      hour: "2-digit",
      minute: "2-digit",
    });
    return formatter.format(new Date(until));
  }, [locales, until]);
  return (
    <CallOut fullWidth>
      <HorizontalGutter>
        <Localized id="suspendInfo-heading">
          <Typography variant="heading3">
            Your account has been temporarily suspended from commenting.
          </Typography>
        </Localized>
        <Localized
          $organization={organization}
          $until={untilDate}
          id="suspendInfo-info"
        >
          <Typography variant="bodyCopy">
            In accordance with {organization}'s community guidelines your
            account has been temporarily suspended. While suspended you will not
            be able to comment, respect or report comments. Please rejoin the
            conversation on {untilDate}.
          </Typography>
        </Localized>
      </HorizontalGutter>
    </CallOut>
  );
};

export default SuspendedInfo;
