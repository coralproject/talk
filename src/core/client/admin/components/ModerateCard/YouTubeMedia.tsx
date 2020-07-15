import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { BaseButton, Flex, Icon } from "coral-ui/components/v2";

import styles from "./Media.css";

interface Props {
  url: string;
  still: string;
  width: number | null;
  height: number | null;
  title: string | null;
  siteID: string;
}

const YouTubeMedia: FunctionComponent<Props> = ({
  url,
  still,
  title,
  width,
  height,
  siteID,
}) => {
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated(!showAnimated);
  }, [showAnimated]);
  const cleanUrl = encodeURIComponent(url);
  return (
    <div className={styles.embed}>
      {!showAnimated && still && (
        <BaseButton onClick={toggleImage} className={styles.toggle}>
          <img src={still} className={styles.image} alt={title || ""} />
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            className={styles.toggleTrigger}
          >
            <Icon size="xl" className={styles.playIcon}>
              play_circle_outline
            </Icon>
            <Localized id="moderate-comment-load-video">
              <p className={styles.playText}>Load Video</p>
            </Localized>
          </Flex>
        </BaseButton>
      )}
      {showAnimated && (
        <iframe
          frameBorder="0"
          width={width || 480}
          height={height || 270}
          allowFullScreen
          title="oEmbed"
          src={`/api/oembed?type=youtube&url=${cleanUrl}&siteID=${siteID}`}
        />
      )}
    </div>
  );
};

export default YouTubeMedia;
