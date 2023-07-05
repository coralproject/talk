import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

interface Props {
  id: string;
  url: string;
  siteID: string;
}

const ExternalMedia: FunctionComponent<Props> = ({ id, url, siteID }) => {
  const component = encodeURIComponent(url);
  return (
    <Frame
      id={id}
      src={`/api/external-media?url=${component}&siteID=${siteID}`}
      sandbox
      showFullHeight
      width="100%"
    />
  );
};

export default ExternalMedia;
