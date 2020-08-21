import React, { FunctionComponent } from "react";

import styles from "./Media.css";

interface Props {
  url: string;
  siteID: string;
}

const ExternalMedia: FunctionComponent<Props> = ({ url, siteID }) => {
  const cleanUrl = encodeURIComponent(url);
  return (
    <div className={styles.embed}>
      <iframe
        frameBorder="0"
        width={480}
        height={320}
        allowFullScreen
        title="External Image"
        src={`/api/external-media?url=${cleanUrl}&siteID=${siteID}`}
      />
    </div>
  );
};

export default ExternalMedia;
