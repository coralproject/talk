import React, { FunctionComponent, useCallback, useState } from "react";

import FlairNotFoundIcon from "coral-ui/components/icons/FlairNotFoundIcon";

import styles from "./FlairBadgeImagePreview.css";

const FlairImageNotFound: FunctionComponent = () => {
  return (
    <div className={styles.notFoundImagePreview}>
      <FlairNotFoundIcon />
    </div>
  );
};

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
    <FlairImageNotFound />
  ) : (
    <img
      className={styles.imagePreview}
      src={url}
      alt={alt}
      onError={onError}
    />
  );
};
