import React, { FunctionComponent, useEffect } from "react";

import { useInView } from "coral-framework/lib/intersection";

import styles from "./InView.css";

interface InViewProps {
  onInView: () => void;
}

const InView: FunctionComponent<InViewProps> = ({ onInView }) => {
  const { inView, intersectionRef } = useInView();

  useEffect(() => {
    if (inView) {
      onInView();
    }
  }, [inView, onInView]);

  return <div className={styles.root} ref={intersectionRef}></div>;
};

export default InView;
