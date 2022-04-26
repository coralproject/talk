import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

interface Props {
  id?: string;
  url: string;
  siteID: string;
  wasToggled?: boolean;
}

const ExternalMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  wasToggled,
}) => {
  const component = encodeURIComponent(url);
  return (
    <Frame
      id={id}
      src={`/api/external-media?url=${component}&siteID=${siteID}`}
      sandbox
      type="external_media"
      wasToggled={wasToggled}
    />
  );
};

export default ExternalMedia;
