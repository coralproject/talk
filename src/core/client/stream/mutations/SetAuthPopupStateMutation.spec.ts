import { Environment, RecordSource } from "relay-runtime";

import { createRelayEnvironment } from "talk-framework/testHelpers";

import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "../local";
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

it("sets state", () => {
  commit(environment, { open: true, focus: false });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(false);
});

it("sets state", () => {
  commit(environment, {
    open: false,
    focus: true,
    href: "https://coralproject.net",
  });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(false);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.href).toEqual("https://coralproject.net");
});

it("keep previous state", () => {
  commit(environment, { open: false, focus: true });
  commit(environment, {});
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(false);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
});

it("change only one", () => {
  commit(environment, { open: false, focus: true });
  commit(environment, { open: true });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
});
