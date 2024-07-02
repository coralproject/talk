import React, { FunctionComponent, useCallback, useState } from "react";

import { BaseButton } from "coral-ui/components/v2";

import styles from "./Media.css";

interface Props {
  url: string | null;
  title: string | null;
}

const TenorMedia: FunctionComponent<Props> = ({ url, title }) => {
  const [showAnimated, setShowAnimated] = useState(false);
  const toggleImage = useCallback(() => {
    setShowAnimated(!showAnimated);
  }, [showAnimated]);
  return (
    <div className={styles.embed}>
      <BaseButton onClick={toggleImage} className={styles.toggle}>
        <img
          src={url ?? ""}
          className={styles.image}
          loading="lazy"
          referrerPolicy="no-referrer"
          alt={title ?? ""}
        />
      </BaseButton>
    </div>
  );
};

export default TenorMedia;
