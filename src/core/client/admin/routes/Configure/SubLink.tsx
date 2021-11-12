import cn from "classnames";
import { useRouter } from "found";
import React, { FunctionComponent } from "react";

import styles from "./SubLink.css";

interface Props {
  children?: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
  anchorLink: string;
}

const SubLink: FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const classNames =
    props.anchorLink === router.match.location.hash
      ? cn(styles.subLinkActive, styles.subLink)
      : styles.subLink;

  return (
    <button className={classNames} onClick={(e) => props.onClick(e)}>
      {props.children}
    </button>
  );
};

export default SubLink;
