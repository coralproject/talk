import { Localized } from "fluent-react/compat";
import { Link } from "found";
import React, { StatelessComponent } from "react";

import { Icon, TextLink } from "talk-ui/components";

import styles from "./GoToCommentLink.css";

interface Props {
  href: string;
  onClick?: React.EventHandler<React.MouseEvent>;
}

const GoToCommentLink: StatelessComponent<Props> = props => {
  return (
    <Link
      Component={TextLink}
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
