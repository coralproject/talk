import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { BaseButton, Flex, Icon } from "coral-ui/components/v2";

import styles from "./Embed.css";

interface Props {
  url: string;
  type: string;
  still: string | null;
  title: string | null;
}

const Embed: FunctionComponent<Props> = ({ url, type, still, title }) => {
  const cleanUrl = encodeURIComponent(url);
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated(!showAnimated);
  }, [showAnimated]);
  if (type === "GIPHY") {
    return (
      <div className={styles.gifEmbed}>
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
        {showAnimated && (
          <BaseButton onClick={toggleImage}>
            <img src={url} alt={title || ""} className={styles.image} />
          </BaseButton>
        )}
      </div>
    );
  } else if (type === "YOUTUBE" || type === "TWITTER") {
    return (
      <div>
        <iframe
          frameBorder="0"
          allowFullScreen
          title="oEmbed"
          src={`/api/oembed?type=${type.toLowerCase()}&url=${cleanUrl}`}
        />
      </div>
    );
  }
  return null;
};

export default Embed;
