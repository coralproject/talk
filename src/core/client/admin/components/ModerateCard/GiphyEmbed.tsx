import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { BaseButton, Flex, Icon } from "coral-ui/components/v2";

import styles from "./Embed.css";

interface Props {
  still: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  video: string | null;
}

const Embed: FunctionComponent<Props> = ({
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
            <Localized id="moderate-comment-play-tif">
              <p className={styles.playText}>Play gif</p>
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
};

export default Embed;
