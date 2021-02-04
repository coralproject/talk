import { FunctionComponent, useEffect } from "react";

import { useUIContext } from "../UIContext";

import styles from "./NoScroll.css";

interface Props {
  /** If set to true, will disable scrolling on `<body>` */
  active?: boolean;
}

/** Counter of current <NoScroll> instances */
let instances = 0;

const NoScroll: FunctionComponent<Props> = ({ active }) => {
  const { window } = useUIContext();
  useEffect(() => {
    if (active) {
      if (instances++ === 0) {
        // Add className.
        window.document.body.className = window.document.body.className
          .split(/\s+/)
          .filter((s) => s)
          .concat(styles.noScroll)
          .join(" ");
      }

      // Cleanup hook.
      return () => {
        if (--instances === 0) {
          // Remove className.
          window.document.body.className = window.document.body.className
            .split(/\s+/)
            .filter((s) => s && s !== styles.noScroll)
            .join(" ");
        }
      };
    }
    return;
  }, [active, window]);
  return null;
};

export default NoScroll;
