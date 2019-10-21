import { useCallback, useEffect, useRef, useState } from "react";
import {
  commitLocalUpdate,
  CSelector,
  GraphQLTaggedNode,
  RecordProxy,
} from "relay-runtime";

import { OmitFragments } from "coral-framework/testHelpers/removeFragmentRefs";
import { DeepPartial } from "coral-framework/types";

import { useCoralContext } from "../bootstrap";
import { LOCAL_ID, LOCAL_TYPE } from "./localState";

/**
 * AdvancedUpdater gives you full access to the Relay Record Proxy to update Local State.
 */
type AdvancedUpdater = (record: RecordProxy) => void;

/**
 * LocalUpdater that allows the caller to update local state either
 * using a simple object or the AdvancedUpdater.
 */
type LocalUpdater<T> = DeepPartial<T> | AdvancedUpdater;

function isAdvancedUpdater(t: LocalUpdater<any>): t is AdvancedUpdater {
  return typeof t === "function";
}

/**
 * applySimplified takes selections defined in a fragment, an object
 * containing data changes and smartly applies it to the record proxy.
 *
 * @param record Record Proxy poing to Local Record
 * @param selections Selections of the fragment
 * @param data Data you want to set
 */
function applySimplified(
  record: RecordProxy,
  selections: ReadonlyArray<any>,
  data: any
) {
  const keys = Object.keys(data);
  keys.forEach(k => {
    const field = selections.find(s => s.alias === k || s.name === k);
    if (!field) {
      throw new Error(`Field '${k}' not found in selection`);
    }
    switch (field.kind) {
      case "ScalarField":
        record.setValue(data[k], field.name);
        return;
      case "LinkedField":
        applySimplified(
          record.getOrCreateLinkedRecord(field.name, field.concreteType),
          field.selections,
          data[k]
        );
        return;
      default:
        throw new Error(
          `Simplified apply does not support field of kind ${field.kind}`
        );
    }
  });
}

/**
 * useLocal is a React Hook that allows you to subscribe to the Client Local State
 * inside of the Relay Cache.
 *
 * Example:
 * ```
 * const [local, setLocal] = useLocal<Local>(graphql`
 *   fragment ProfileLocal on Local {
 *      profileTab
 *    }
 * `);
 * ```
 *
 * @param fragmentSpec graphql fragment
 */
function useLocal<T>(
  fragmentSpec: GraphQLTaggedNode
): [OmitFragments<T>, (update: LocalUpdater<OmitFragments<T>>) => void] {
  const fragment =
    typeof fragmentSpec === "function"
      ? fragmentSpec().default
      : (fragmentSpec as any).data().default;
  if (fragment.kind !== "Fragment") {
    throw new Error("Expected fragment");
  }
  if (fragment.type !== LOCAL_TYPE) {
    throw new Error(`Type must be "Local" in "Fragment ${fragment.name}"`);
  }
  const selector: CSelector<any> = {
    dataID: LOCAL_ID,
    node: { selections: fragment.selections },
    variables: {},
  };
  const { relayEnvironment } = useCoralContext();
  const [local, setLocal] = useState<T>(
    () => relayEnvironment.lookup(selector).data as T
  );
  const localUpdate = useCallback(
    (update: LocalUpdater<T>) => {
      commitLocalUpdate(relayEnvironment, store => {
        const record = store.get(LOCAL_ID)!;
        if (isAdvancedUpdater(update)) {
          update(record);
        } else {
          applySimplified(record, fragment.selections[0].selections, update);
        }
      });
      return;
    },
    [relayEnvironment, fragment]
  );
  const firstRun = useRef(true);

  useEffect(() => {
    const snapshot = relayEnvironment.lookup(selector);
    const subscription = relayEnvironment.subscribe(snapshot, update =>
      setLocal(update.data as T)
    );
    if (!firstRun) {
      setLocal(snapshot.data as T);
    }
    firstRun.current = false;
    return () => {
      subscription.dispose();
    };
  }, [relayEnvironment, fragment]);
  return [local, localUpdate];
}

export default useLocal;
