import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { MatchMedia } from "coral-ui/components/v2";

import styles from "./YouTubeMedia.css";

interface Props {
  id?: string;
  url: string;
  siteID: string;
  isToggled?: boolean;
}

const YouTubeMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  isToggled,
}) => {
  const component = encodeURIComponent(url);
  const { browserInfo } = useCoralContext();
  return (
    <div className={styles.container}>
      <MatchMedia lteDeviceWidth="mobileMax">
        {(matches) =>
          matches || browserInfo.mobile ? (
            <Frame
              id={id}
              width="100%"
              src={`/api/oembed?type=youtube&url=${component}&siteID=${siteID}`}
              isToggled={isToggled}
              type="youtube"
              mobile={true}
            />
          ) : (
            <Frame
              id={id}
              width="75%"
              src={`/api/oembed?type=youtube&url=${component}&siteID=${siteID}`}
              isToggled={isToggled}
              type="youtube"
            />
          )
        }
      </MatchMedia>
    </div>
  );
};
export default YouTubeMedia;
