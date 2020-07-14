import React, { FunctionComponent } from "react";

import { MediaLink } from "coral-common/helpers/findMediaLinks";
import MediaConfirmPrompt from "./MediaConfirmPrompt";
import MediaPreview from "./MediaPreview";

import styles from "./MediaConfirmation.css";
interface MediaConfig {
  giphy: {
    enabled: boolean;
  };
  twitter: {
    enabled: boolean;
  };
  youtube: {
    enabled: boolean;
  };
}

interface Props {
  media: MediaLink & {
    confirmed: boolean;
  };
  onConfirm: () => void;
  onRemove: () => void;
  config: MediaConfig;
}

const MediaConfirmation: FunctionComponent<Props> = ({
  media,
  onConfirm,
  config,
  onRemove,
}) => {
  return (
    <div className={styles.root}>
      {!media.confirmed && (
        <MediaConfirmPrompt
          media={media}
          onConfirm={onConfirm}
          onRemove={onRemove}
        />
      )}
      {media.confirmed && (
        <MediaPreview media={media} onRemove={onRemove} config={config} />
      )}
    </div>
  );
};

export default MediaConfirmation;
