import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./GoogleButton.css";

interface Props {
  onClick: PropTypesOf<typeof Button>["onClick"];
  children: React.ReactNode;
}

const googleIcon = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.2924 9.46094C17.2924 9.00391 17.2221 8.51172 17.1518 7.98438H8.85491V11.0078H13.8119C13.7065 11.5352 13.4955 12.0625 13.2143 12.5547C12.7924 13.1875 12.2651 13.7148 11.6323 14.0664C10.8237 14.5586 9.9096 14.7695 8.85491 14.7695C7.87054 14.7695 6.95647 14.5234 6.14788 14.0312C5.30413 13.5391 4.67132 12.8711 4.17913 12.0273C3.68694 11.1836 3.44085 10.2695 3.44085 9.25C3.44085 8.08984 3.75725 7.03516 4.39007 6.12109C4.95257 5.27734 5.726 4.64453 6.71038 4.22266C7.6596 3.80078 8.64397 3.66016 9.62835 3.80078C10.683 3.94141 11.5619 4.39844 12.3354 5.10156L14.6908 2.81641C13.0737 1.30469 11.1049 0.53125 8.85491 0.53125C7.27288 0.53125 5.83147 0.953125 4.49554 1.72656C3.1596 2.5 2.06975 3.55469 1.29632 4.89062C0.52288 6.22656 0.136161 7.70312 0.136161 9.25C0.136161 10.832 0.52288 12.2734 1.29632 13.6094C2.06975 14.9453 3.1596 16.0352 4.49554 16.8086C5.83147 17.582 7.27288 17.9688 8.85491 17.9688C10.5073 17.9688 11.9838 17.6172 13.2494 16.8789C14.5151 16.1758 15.5346 15.1562 16.2377 13.8555C16.9408 12.5898 17.2924 11.1133 17.2924 9.46094Z"
      fill="white"
    />
  </svg>
);

const GoogleButton: FunctionComponent<Props> = (props) => (
  <Button
    className={styles.button}
    variant="filled"
    color="none"
    textSize="small"
    marginSize="small"
    upperCase
    fullWidth
    onClick={props.onClick}
  >
    <Flex alignItems="center" justifyContent="center">
      <div className={styles.icon}>{googleIcon}</div>
      <span>{props.children}</span>
    </Flex>
  </Button>
);

export default GoogleButton;
