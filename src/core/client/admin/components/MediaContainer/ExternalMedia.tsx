import React, { FunctionComponent, HTMLProps } from "react";

import styles from "./Media.css";

interface Props {
  url: string;
  siteID: string;
}

const ExternalMedia: FunctionComponent<Props> = ({ url, siteID }) => {
  const cleanUrl = encodeURIComponent(url);

  const attrs: HTMLProps<HTMLIFrameElement> = {};

  // Force loading=lazy to be added for enhanced loading support on supported
  // browsers.
  (attrs as any).loading = "lazy";

  return (
    <div className={styles.embed}>
      <iframe
        referrerPolicy="no-referrer"
        // Sandbox all operations inside this frame.
        sandbox=""
        frameBorder="0"
        width={480}
        height={320}
        allowFullScreen
        title="External Image"
        src={`/api/external-media?url=${cleanUrl}&siteID=${siteID}`}
        {...attrs}
      />
    </div>
  );
};

export default ExternalMedia;
