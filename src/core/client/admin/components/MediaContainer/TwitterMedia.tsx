import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

import styles from "./Media.css";

interface Props {
  id: string;
  url: string;
  siteID: string;
  wasToggled?: boolean;
}

const TwitterMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  wasToggled,
}) => {
  const component = encodeURIComponent(url);
  return (
    <div className={styles.embed}>
      <Frame
        id={id}
        src={`/api/oembed?type=twitter&url=${component}&siteID=${siteID}`}
        wasToggled={wasToggled}
        type="twitter"
      />
    </div>
  );
};

export default TwitterMedia;
