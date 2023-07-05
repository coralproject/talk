import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";

import DashboardBox from "./DashboardBox";
import Loader from "./Loader";

import styles from "./TodayDashboardBox.css";

interface Props {
  icon: "forum" | "close" | "recent_actors" | "person_add" | "block";
  loading: boolean;
  children?: React.ReactNode;
}

const TodayDashboardBox: FunctionComponent<Props> = ({
  children,
  icon,
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
              [styles.tealIcon]: icon === "forum",
              [styles.redIcon]: icon === "close" || icon === "block",
              [styles.greyIcon]: icon === "recent_actors",
              [styles.blueIcon]: icon === "person_add",
            })}
          >
            <Icon size="md">{icon}</Icon>
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
