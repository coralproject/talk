import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { ButtonPlayIcon, SvgIcon } from "coral-ui/components/icons";
import { BaseButton, Button, Flex } from "coral-ui/components/v2";

import styles from "./Media.css";

interface Props {
  still: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  video: string | null;
  url: string | null;
}

const GiphyMedia: FunctionComponent<Props> = ({
  still,
  title,
  width,
  height,
  video,
  url,
}) => {
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated(!showAnimated);
  }, [showAnimated]);

  if (!still && !video) {
    // Fallback to show/hide gif if there is no still and no video
    return (
      <>
        <Button
          iconLeft
          variant="outlined"
          color="regular"
          onClick={toggleImage}
          size="small"
          className={styles.showHideButton}
          aria-expanded="false"
        >
          {showAnimated ? (
            <Localized id="comments-embedLinks-hide-gif">Hide GIF</Localized>
          ) : (
            <Localized id="comments-embedLinks-show-gif">Show GIF</Localized>
          )}
        </Button>
        {showAnimated && (
          <div className={styles.embed}>
            <img
              src={url ?? ""}
              className={styles.image}
              loading="lazy"
              referrerPolicy="no-referrer"
              alt={title ?? ""}
            />
          </div>
        )}
      </>
    );
  }

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
            <SvgIcon
              size="xl"
              className={styles.playIcon}
              Icon={ButtonPlayIcon}
            />
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
