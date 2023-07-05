import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import { Icon, TextLink } from "coral-ui/components/v2";

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
      <Icon>chevron_right</Icon>
    </Link>
  );
};

export default GoToCommentLink;
