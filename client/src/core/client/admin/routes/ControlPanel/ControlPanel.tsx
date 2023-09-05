import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { useMutation } from "coral-framework/lib/relay";
import { FieldSet, FormField, Label } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import ConfigBox from "../Configure/ConfigBox";
import Header from "../Configure/Header";
import FlushRedisMutation from "./FlushRedisMutation";

import styles from "./ControlPanel.css";

const ControlPanel: FunctionComponent = () => {
  const [isTriggered, setTriggered] = useState<boolean>(false);
  const flushRedis = useMutation(FlushRedisMutation);

  const onFlush = useCallback(async () => {
    await flushRedis();
    setTriggered(true);
  }, [flushRedis]);

  return (
    <MainLayout className={styles.root} data-testid="controlPanel-container">
      <ConfigBox
        title={
          <Localized id="controlPanel-redis-redis ">
            <Header container="h2">Redis</Header>
          </Localized>
        }
      >
        <FormField container={<FieldSet />}>
          <Localized id="controlPanel-redis-flushRedis">
            <Label>Flush Redis</Label>
          </Localized>

          <Localized id="controlPanel-redis-flush">
            <Button disabled={isTriggered} onClick={onFlush}>
              Flush
            </Button>
          </Localized>
        </FormField>
      </ConfigBox>
    </MainLayout>
  );
};

export default ControlPanel;
