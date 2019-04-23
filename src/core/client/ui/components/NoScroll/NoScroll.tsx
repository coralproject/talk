import { StatelessComponent, useEffect } from "react";

import styles from "./NoScroll.css";

interface Props {
  /** If set to true, will disable scrolling on `<body>` */
  active?: boolean;
}

/** Counter of current <NoScroll> instances */
let instances = 0;

const NoScroll: StatelessComponent<Props> = ({ active }) => {
  useEffect(() => {
    if (active) {
      if (instances++ === 0) {
        // Add className.
        document.body.className = document.body.className
          .split(/\s+/)
          .filter(s => s)
          .concat(styles.noScroll)
          .join(" ");
      }

      // Cleanup hook.
      return () => {
        if (--instances === 0) {
          // Remove className.
          document.body.className = document.body.className
            .split(/\s+/)
            .filter(s => s && s !== styles.noScroll)
            .join(" ");
        }
      };
    }
    return;
  }, [active]);
  return null;
};

export default NoScroll;
