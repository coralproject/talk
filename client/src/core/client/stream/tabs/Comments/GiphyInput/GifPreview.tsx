import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { ButtonSvgIcon, RemoveCircleIcon } from "coral-ui/components/icons";
import { Button } from "coral-ui/components/v2";

import styles from "./GifPreview.css";

interface Props {
  url: string;
  title?: string;
  onRemove: () => void;
}

const GifPreview: FunctionComponent<Props> = ({ onRemove, url, title }) => {
  if (!url) {
    return null;
  }
  return (
    <div className={styles.root}>
      <div className={styles.imageWrapper}>
        <Button
          onClick={onRemove}
          iconLeft
          color="mono"
          className={styles.button}
        >
          <ButtonSvgIcon Icon={RemoveCircleIcon} />
          <Localized id="comments-commentForm-gifPreview-remove">
            Remove
          </Localized>
        </Button>
        <img src={url} alt={title} className={styles.image} />
      </div>
    </div>
  );
};

export default GifPreview;
