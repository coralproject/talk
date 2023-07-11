import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import {
  AppWindowDisableIcon,
  SingleNeutralActionsBlockIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import { DropdownButton, Spinner } from "coral-ui/components/v2";

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
  const icon = allSiteBan
    ? SingleNeutralActionsBlockIcon
    : AppWindowDisableIcon;
  return (
    <Localized id={localizationId}>
      <DropdownButton
        icon={
          <div className={styles.banIcon}>
            <SvgIcon Icon={icon} />
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
