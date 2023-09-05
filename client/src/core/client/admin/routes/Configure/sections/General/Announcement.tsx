import { Localized } from "@fluent/react/compat";
import { DateTime } from "luxon";
import React, { FunctionComponent, useMemo } from "react";

import { useDateTimeFormatter } from "coral-framework/hooks";
import {
  FormField,
  FormFieldFooter,
  FormFieldHeader,
  Label,
  Textarea,
} from "coral-ui/components/v2";

interface Props {
  content: string;
  createdAt: string;
  duration: number;
}

const Announcement: FunctionComponent<Props> = ({
  content,
  createdAt,
  duration,
}) => {
  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = useMemo(() => {
    const disableAt = DateTime.fromISO(createdAt)
      .plus({ seconds: duration })
      .toJSDate();

    return formatter(disableAt);
  }, [createdAt, duration, formatter]);
  return (
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-general-announcements-current-label">
          <Label htmlFor="configure-general-announcements-current-content">
            Current announcement
          </Label>
        </Localized>
      </FormFieldHeader>
      <Textarea
        fullwidth
        disabled
        name="configure-general-announcements-current-content"
        value={content}
      />
      <Localized
        id="configure-general-announcements-current-duration"
        vars={{ timestamp: formattedDate }}
      >
        <FormFieldFooter>
          This announcement will automatically end on:{" "}
          <strong>{formattedDate}</strong>
        </FormFieldFooter>
      </Localized>
    </FormField>
  );
};

export default Announcement;
