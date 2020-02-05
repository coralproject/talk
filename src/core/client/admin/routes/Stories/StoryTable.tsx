import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
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
  viewer: PropTypesOf<typeof StoryRowContainer>["viewer"] | null;
  stories: Array<
    { id: string } & PropTypesOf<typeof StoryRowContainer>["story"]
  >;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
  isSearching: boolean;
}

const StoryTable: FunctionComponent<Props> = props => (
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

            <Localized id="stories-column-author">
              <TableCell className={styles.authorColumn}>Author</TableCell>
            </Localized>
            <Localized id="stories-column-site">
              <TableCell className={styles.siteColumn}>Site</TableCell>
            </Localized>
            <Localized id="stories-column-publishDate">
              <TableCell className={styles.publishDateColumn}>
                Publish Date
              </TableCell>
            </Localized>
            <Localized id="stories-column-status">
              <TableCell className={styles.statusColumn}>Status</TableCell>
            </Localized>
          </TableRow>
        </TableHead>
        <TableBody>
          {!props.loading &&
            props.stories.map(u => (
              <StoryRowContainer key={u.id} story={u} viewer={props.viewer!} />
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
    </HorizontalGutter>
  </>
);

export default StoryTable;
