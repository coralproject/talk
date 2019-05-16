import { Environment, RecordSource } from "relay-runtime";

import { createRelayEnvironment } from "coral-framework/testHelpers";

import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "../local";
import { commit } from "./ShowAuthPopupMutation";

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

it("opens popup", () => {
  commit(environment, { view: "SIGN_IN" });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(false);
  expect(source.get(AUTH_POPUP_ID)!.view).toEqual("SIGN_IN");
});

it("focuses popup", () => {
  commit(environment, { view: "SIGN_IN" });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.view).toEqual("SIGN_IN");
});

it("only change view when opened and focused", () => {
  commit(environment, { view: "FORGOT_PASSWORD" });
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.view).toEqual("FORGOT_PASSWORD");
});
