import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { MatchMedia } from "coral-ui/components/v2";

interface Props {
  id?: string;
  url: string;
  siteID: string;
  isToggled?: boolean;
}

const ExternalMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  isToggled,
}) => {
  const component = encodeURIComponent(url);
  const { browserInfo } = useCoralContext();
  return (
    <MatchMedia lteDeviceWidth="mobileMax">
      {(matches) =>
        matches || browserInfo.mobile ? (
          <Frame
            id={id}
            src={`/api/external-media?url=${component}&siteID=${siteID}`}
            sandbox
            isToggled={isToggled}
            type="external_media"
            width="100%"
            mobile={true}
          />
        ) : (
          <Frame
            id={id}
            src={`/api/external-media?url=${component}&siteID=${siteID}`}
            sandbox
            isToggled={isToggled}
            type="external_media"
            width="75%"
          />
        )
      }
    </MatchMedia>
  );
};

export default ExternalMedia;
