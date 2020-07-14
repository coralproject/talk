import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { BaseButton, Flex, Icon } from "coral-ui/components/v2";

import styles from "./Media.css";

interface Props {
  url: string;
  type: string;
  still: string | null;
  title: string | null;
  width: string | null;
  height: string | null;
  video: string | null;
}

const Media: FunctionComponent<Props> = ({
  url,
  type,
  still,
  title,
  width,
  height,
  video,
}) => {
  const cleanUrl = encodeURIComponent(url);
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated(!showAnimated);
  }, [showAnimated]);
  if (type === "GIPHY") {
    return (
      <div className={styles.embed}>
        {!showAnimated && still && (
          <BaseButton onClick={toggleImage} className={styles.gifToggle}>
            <img src={still} className={styles.image} alt={title || ""} />
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              className={styles.gifToggleTrigger}
            >
              <Icon size="xl" className={styles.playIcon}>
                play_circle_outline
              </Icon>
              <Localized id="moderate-comment-play-gif">
                <p className={styles.playText}>Play GIF</p>
              </Localized>
            </Flex>
          </BaseButton>
        )}
        {showAnimated && video && (
          <BaseButton onClick={toggleImage}>
            <video
              width={width || undefined}
              height={height || undefined}
              autoPlay
              loop
            >
              <source src={video} type="video/mp4" />
            </video>
          </BaseButton>
        )}
      </div>
    );
  } else if (type === "YOUTUBE" || type === "TWITTER") {
    return (
      <div className={styles.embed}>
        <iframe
          frameBorder="0"
          width={width || 450}
          height={height || 250}
          allowFullScreen
          title="oEmbed"
          src={`/api/oembed?type=${type.toLowerCase()}&url=${cleanUrl}`}
        />
      </div>
    );
  }
  return null;
};

export default Media;
