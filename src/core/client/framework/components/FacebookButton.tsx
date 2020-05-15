import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./FacebookButton.css";

interface Props {
  onClick: PropTypesOf<typeof Button>["onClick"];
  children: React.ReactNode;
  className?: string;
}

const facebookIcon = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0893 1.25391C16.0893 1.00781 15.9838 0.796875 15.808 0.621094C15.6323 0.480469 15.4213 0.375 15.2104 0.375H1.21819C0.936942 0.375 0.726005 0.480469 0.58538 0.621094C0.409598 0.796875 0.339286 1.00781 0.339286 1.25391V15.2461C0.339286 15.4922 0.409598 15.7031 0.58538 15.8789C0.726005 16.0547 0.936942 16.125 1.21819 16.125H8.74163V10.0078H6.70257V7.65234H8.74163V5.89453C8.74163 4.91016 9.02288 4.13672 9.58538 3.57422C10.1479 3.04688 10.8862 2.76562 11.8002 2.76562C12.5033 2.76562 13.1362 2.80078 13.6283 2.83594V4.98047H12.3627C11.9057 4.98047 11.5893 5.08594 11.4135 5.29688C11.2729 5.47266 11.2026 5.75391 11.2026 6.14062V7.65234H13.558L13.2416 10.0078H11.2026V16.125H15.2104C15.4565 16.125 15.6674 16.0547 15.8432 15.8789C15.9838 15.7031 16.0893 15.4922 16.0893 15.2461V1.25391Z"
      fill="white"
    />
  </svg>
);

const FacebookButton: FunctionComponent<Props> = (props) => (
  <Button
    className={cn(CLASSES.login.facebookButton, styles.button)}
    variant="filled"
    color="none"
    fontSize="small"
    paddingSize="small"
    upperCase
    fullWidth
    onClick={props.onClick}
  >
    <Flex alignItems="center" justifyContent="center">
      <div className={styles.icon}>{facebookIcon}</div>
      <span>{props.children}</span>
    </Flex>
  </Button>
);

export default FacebookButton;
