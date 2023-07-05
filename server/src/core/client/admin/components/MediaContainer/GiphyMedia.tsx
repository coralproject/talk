import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { BaseButton, Flex, Icon } from "coral-ui/components/v2";

import styles from "./Media.css";

interface Props {
  still: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  video: string | null;
}

const GiphyMedia: FunctionComponent<Props> = ({
  still,
  title,
  width,
  height,
  video,
}) => {
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated(!showAnimated);
  }, [showAnimated]);
  return (
    <div className={styles.embed}>
      {!showAnimated && still && (
        <BaseButton onClick={toggleImage} className={styles.toggle}>
          <img
            src={still}
            className={styles.image}
            width={width || undefined}
            height={height || undefined}
            loading="lazy"
            referrerPolicy="no-referrer"
            alt={title || ""}
          />
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            className={styles.toggleTrigger}
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
            className={styles.image}
            width={width || undefined}
            height={height || undefined}
            title={title || ""}
            // TODO: (wyattjoh) auto pause when out of view
            autoPlay
            loop
          >
            <source src={video} type="video/mp4" />
          </video>
        </BaseButton>
      )}
    </div>
  );
};

export default GiphyMedia;
