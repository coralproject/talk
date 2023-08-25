import React, { FunctionComponent, useCallback, useState } from "react";

import { SvgIcon } from "coral-ui/components/icons";
import ImageFileWarningIcon from "coral-ui/components/icons/ImageFileWarningIcon";

import styles from "./FlairBadgeImagePreview.css";

interface Props {
  url: string;
  alt: string;
}

export const FlairBadgeImagePreview: FunctionComponent<Props> = ({
  url,
  alt,
}) => {
  const [error, setError] = useState<boolean>(false);
  const onError = useCallback(() => {
    setError(true);
  }, [setError]);

  return error ? (
    <SvgIcon Icon={ImageFileWarningIcon} size="lg" />
  ) : (
    <img
      className={styles.imagePreview}
      src={url}
      alt={alt}
      onError={onError}
    />
  );
};
