import cn from "classnames";
import { useRouter } from "found";
import React, { FunctionComponent, MouseEventHandler } from "react";

import { BaseButton } from "coral-ui/components/v2";

import styles from "./SubLink.css";

interface Props {
  href: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

const SubLink: FunctionComponent<Props> = (props) => {
  const router = useRouter();
  // If the location hash matches the sublink's anchor hash, then the sublink is active
  const anchorHash = props.href.substring(props.href.indexOf("#"));
  const classNames =
    anchorHash === router.match.location.hash
      ? cn(styles.subLinkActive, styles.subLink)
      : styles.subLink;

  return (
    <BaseButton className={classNames} onClick={props.onClick}>
      {props.children}
    </BaseButton>
  );
};

export default SubLink;
