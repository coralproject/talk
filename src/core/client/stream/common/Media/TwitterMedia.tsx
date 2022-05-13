import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

interface Props {
  id?: string;
  url: string;
  siteID: string;
}

const TwitterMedia: FunctionComponent<Props> = ({ id, url, siteID }) => {
  const component = encodeURIComponent(url);
  return (
    <Frame
      id={id}
      width="100%"
      src={`/api/oembed?type=twitter&url=${component}&siteID=${siteID}`}
    />
  );
};

export default TwitterMedia;
