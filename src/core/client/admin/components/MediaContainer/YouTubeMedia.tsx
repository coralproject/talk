import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import Frame from "coral-framework/components/Frame";
import { BaseButton, Flex, Icon } from "coral-ui/components/v2";

import styles from "./Media.css";

interface Props {
  id: string;
  url: string;
  still: string;
  title: string | null;
  siteID: string;
}

const YouTubeMedia: FunctionComponent<Props> = ({
  id,
  url,
  still,
  title,
  siteID,
}) => {
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated((a) => !a);
  }, []);

  const component = encodeURIComponent(url);

  return (
    <div className={styles.embed}>
      {!showAnimated && still && (
        <BaseButton onClick={toggleImage} className={styles.toggle}>
          <img
            src={still}
            className={styles.image}
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
            <Localized id="moderate-comment-load-video">
              <p className={styles.playText}>Load Video</p>
            </Localized>
          </Flex>
        </BaseButton>
      )}
      {showAnimated && (
        <Frame
          id={id}
          src={`/api/oembed?type=youtube&url=${component}&siteID=${siteID}`}
          showFullHeight
        />
      )}
    </div>
  );
};

export default YouTubeMedia;
