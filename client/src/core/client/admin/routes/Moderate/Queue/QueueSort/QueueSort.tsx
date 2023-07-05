import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useLocal, useMutation } from "coral-framework/lib/relay";
import { Option, SelectField } from "coral-ui/components/v2";

import { QueueSortLocal } from "coral-admin/__generated__/QueueSortLocal.graphql";

import { ChangeQueueSortMutation } from "./ChangeQueueSortMutation";

import styles from "./QueueSort.css";

const QueueSort: FunctionComponent = () => {
  const changeQueueSort = useMutation(ChangeQueueSortMutation);
  const onChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const sortOrder = e.target.value as "CREATED_AT_DESC" | "CREATED_AT_ASC";
      await changeQueueSort({ sortOrder });
    },
    [changeQueueSort]
  );

  const [{ moderationQueueSort }] = useLocal<QueueSortLocal>(graphql`
    fragment QueueSortLocal on Local {
      moderationQueueSort
    }
  `);
  const sort = moderationQueueSort ? moderationQueueSort : "CREATED_AT_DESC";

  return (
    <div className={styles.root}>
      <SelectField value={sort} onChange={onChange}>
        <Localized id="queue-sortMenu-newest">
          <Option value="CREATED_AT_DESC">Newest</Option>
        </Localized>
        <Localized id="queue-sortMenu-oldest">
          <Option value="CREATED_AT_ASC">Oldest</Option>
        </Localized>
      </SelectField>
    </div>
  );
};

export default QueueSort;
