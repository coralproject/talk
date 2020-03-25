import React, { FunctionComponent, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { ShowAbsoluteTimestampEvent } from "coral-stream/events";
import { Timestamp as BaseTimestamp } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

const TimeStamp: FunctionComponent<PropTypesOf<typeof BaseTimestamp>> = (
  props
) => {
  const emitEvent = useViewerEvent(ShowAbsoluteTimestampEvent);
  const handleOnToggle = useCallback(
    (absolute: boolean) => {
      if (absolute) {
        emitEvent();
      }
      if (props.onToggleAbsolute) {
        return props.onToggleAbsolute(absolute);
      }
    },
    [props.onToggleAbsolute, emitEvent]
  );
  return <BaseTimestamp {...props} onToggleAbsolute={handleOnToggle} />;
};

export default TimeStamp;
