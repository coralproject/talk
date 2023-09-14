import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useState } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import StoryInfoDrawer from "coral-admin/components/StoryInfoDrawer";
import { PropTypesOf } from "coral-framework/types";
import { Flex, HorizontalGutter, Spinner } from "coral-ui/components/v2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2/Table";

import EmptyMessage from "./EmptyMessage";
import NoMatchMessage from "./NoMatchMessage";
import StoryRowContainer from "./StoryRowContainer";

import styles from "./StoryTable.css";

interface Props {
  stories: Array<
    { id: string } & PropTypesOf<typeof StoryRowContainer>["story"]
  >;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
  isSearching: boolean;
  multisite: boolean;
}

const StoryTable: FunctionComponent<Props> = (props) => {
  const [storyDrawerVisibile, setStoryDrawerVisible] = useState(false);
  const [expandedStoryID, setExpandedStoryID] = useState("");

  return (
    <>
      <HorizontalGutter size="double">
        <Table fullWidth>
          <TableHead>
            <TableRow>
              <TableCell className={styles.titleColumn}>
                <Localized id="stories-column-title">
                  <span>Title</span>
                </Localized>{" "}
                <span className={styles.clickToModerate}>
                  (
                  <Localized id="stories-column-clickToModerate">
                    <span>Click title to moderate story</span>
                  </Localized>
                  )
                </span>
              </TableCell>

              <Localized id="stories-column-reportedCount">
                <TableCell className={styles.reportedCountColumn}>
                  Reported
                </TableCell>
              </Localized>
              <Localized id="stories-column-pendingCount">
                <TableCell className={styles.pendingCountColumn}>
                  Pending
                </TableCell>
              </Localized>
              <Localized id="stories-column-publishedCount">
                <TableCell className={styles.totalCountColumn}>
                  Published
                </TableCell>
              </Localized>
              <Localized id="stories-column-status">
                <TableCell className={styles.statusColumn}>Status</TableCell>
              </Localized>
              <Localized id="stories-column-actions">
                <TableCell className={styles.actionsColumn}>Actions</TableCell>
              </Localized>
            </TableRow>
          </TableHead>
          <TableBody>
            {!props.loading &&
              props.stories.map((u) => (
                <StoryRowContainer
                  key={u.id}
                  story={u}
                  multisite={props.multisite}
                  onOpenInfoDrawer={() => {
                    setExpandedStoryID(u.id);
                    setStoryDrawerVisible(true);
                  }}
                />
              ))}
          </TableBody>
        </Table>
        {!props.loading &&
          props.stories.length === 0 &&
          (props.isSearching ? <NoMatchMessage /> : <EmptyMessage />)}
        {props.loading && (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {props.hasMore && (
          <Flex justifyContent="center">
            <AutoLoadMore
              disableLoadMore={props.disableLoadMore}
              onLoadMore={props.onLoadMore}
            />
          </Flex>
        )}
        <StoryInfoDrawer
          storyID={expandedStoryID}
          open={storyDrawerVisibile}
          onClose={() => setStoryDrawerVisible(false)}
        />
      </HorizontalGutter>
    </>
  );
};

export default StoryTable;
