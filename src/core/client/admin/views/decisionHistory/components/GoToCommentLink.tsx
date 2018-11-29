import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Icon, TextLink } from "talk-ui/components";

import styles from "./GoToCommentLink.css";

interface Props {
  href?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
}

const GoToCommentLink: StatelessComponent<Props> = props => (
  <TextLink className={styles.root} onClick={props.onClick} href={props.href}>
    <Localized id="decisionHistory-goToComment">
      <span>Go to comment</span>
    </Localized>{" "}
    <Icon>chevron_right</Icon>
  </TextLink>
);

export default GoToCommentLink;
