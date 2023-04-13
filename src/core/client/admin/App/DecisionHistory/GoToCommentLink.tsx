import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import { ArrowRightIcon, SvgIcon } from "coral-ui/components/icons";
import { TextLink } from "coral-ui/components/v2";

import styles from "./GoToCommentLink.css";

interface Props {
  href: string;
  onClick?: React.EventHandler<React.MouseEvent>;
}

const GoToCommentLink: FunctionComponent<Props> = (props) => {
  return (
    <Link
      as={TextLink}
      className={styles.root}
      to={props.href}
      onClick={props.onClick}
    >
      <Localized id="decisionHistory-goToComment">
        <span>Go to comment</span>
      </Localized>{" "}
      <SvgIcon className={styles.arrow} size="xs" Icon={ArrowRightIcon} />
    </Link>
  );
};

export default GoToCommentLink;
