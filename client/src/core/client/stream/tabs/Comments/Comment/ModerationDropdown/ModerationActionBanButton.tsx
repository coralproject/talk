import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { DropdownButton, Icon, Spinner } from "coral-ui/components/v2";

import styles from "./ModerationActionBanButton.css";

interface Props {
  allSiteBan: boolean;
  disabled: boolean;
  onClick?: () => void;
  showSpinner?: boolean;
}

const ModerationActionBanButton: FunctionComponent<Props> = ({
  allSiteBan,
  disabled,
  onClick,
  showSpinner = false,
}) => {
  const localizationId = allSiteBan
    ? "comments-moderationDropdown-ban"
    : "comments-moderationDropdown-siteBan";
  const defaultText = allSiteBan ? "Ban User" : "Site Ban";
  return (
    <Localized id={localizationId}>
      <DropdownButton
        icon={
          <div className={styles.banIcon}>
            <Icon size="sm">block</Icon>
          </div>
        }
        adornment={
          showSpinner ? (
            <Spinner size="xs" className={styles.spinner} />
          ) : undefined
        }
        className={CLASSES.moderationDropdown.banUserButton}
        classes={{
          root: styles.label,
          mouseHover: styles.mouseHover,
        }}
        disabled={disabled}
        onClick={onClick}
      >
        {defaultText}
      </DropdownButton>
    </Localized>
  );
};

export default ModerationActionBanButton;
