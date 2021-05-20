import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

interface Props {
  id?: string;
  url: string;
  siteID: string;
  className?: string;
}

const ExternalMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  className,
}) => {
  const component = encodeURIComponent(url);

  return (
    <Frame
      id={id}
      src={`/api/external-media?url=${component}&siteID=${siteID}`}
      sandbox
      className={className}
    />
  );
};

export default ExternalMedia;
