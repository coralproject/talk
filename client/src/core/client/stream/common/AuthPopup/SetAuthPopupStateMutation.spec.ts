import { Environment, RecordSource } from "relay-runtime";

import { createRelayEnvironment } from "coral-framework/testHelpers";
import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "coral-stream/local";

import { commit } from "./SetAuthPopupStateMutation";

let environment: Environment;
const source: RecordSource = new RecordSource();

beforeAll(() => {
  environment = createRelayEnvironment({
    source,
    initLocalState: (localRecord, sourceProxy) => {
      const record = sourceProxy.create(AUTH_POPUP_ID, AUTH_POPUP_TYPE);
      record.setValue(false, "open");
      record.setValue(false, "focus");
      localRecord.setLinkedRecord(record, "authPopup");
    },
  });
});

it("sets state", async () => {
  await commit(environment, { open: true, focus: false });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(false);
});

it("sets state", async () => {
  await commit(environment, {
    open: false,
    focus: true,
    href: "https://coralproject.net",
  });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(false);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.href).toEqual("https://coralproject.net");
});

it("keep previous state", async () => {
  await commit(environment, { open: false, focus: true });
  await commit(environment, {});
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(false);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
});

it("change only one", async () => {
  await commit(environment, { open: false, focus: true });
  await commit(environment, { open: true });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
});
