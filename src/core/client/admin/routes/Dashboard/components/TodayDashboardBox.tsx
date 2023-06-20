import cn from "classnames";
import React, { ComponentType, FunctionComponent } from "react";

import {
  CloseIcon,
  DeleteIcon,
  MessagesBubbleSquareIcon,
  MultipleActionsChatIcon,
  SingleNeutralActionsAddIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import DashboardBox from "./DashboardBox";
import Loader from "./Loader";

import styles from "./TodayDashboardBox.css";

interface Props {
  Icon: ComponentType;
  loading: boolean;
  children?: React.ReactNode;
}

const TodayDashboardBox: FunctionComponent<Props> = ({
  children,
  Icon,
  loading,
}) => {
  return (
    <DashboardBox className={styles.root}>
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <Flex spacing={5} className={styles.outer}>
          <div
            className={cn(styles.icon, {
              [styles.tealIcon]: Icon === MessagesBubbleSquareIcon,
              [styles.redIcon]: Icon === DeleteIcon || Icon === CloseIcon,
              [styles.greyIcon]: Icon === MultipleActionsChatIcon,
              [styles.blueIcon]: Icon === SingleNeutralActionsAddIcon,
            })}
          >
            <SvgIcon Icon={Icon} />
          </div>
          <HorizontalGutter>
            <Flex
              direction="column"
              className={styles.inner}
              justifyContent="space-between"
            >
              {children}
            </Flex>
          </HorizontalGutter>
        </Flex>
      )}
    </DashboardBox>
  );
};

export default TodayDashboardBox;
