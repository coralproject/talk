import { EventEmitter2 } from "eventemitter2";
import { Environment, RecordSource } from "relay-runtime";
import sinon from "sinon";

import { createRelayEnvironment } from "coral-framework/testHelpers";

import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "../../local";
import { commit } from "./ShowAuthPopupMutation";

let environment: Environment;
let source: RecordSource;

beforeEach(() => {
  source = new RecordSource();
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

it("emits ShowAuthPopupEvent and LoginPromptEvent on SIGN_IN", async () => {
  const view = "SIGN_IN";
  const eventEmitter = new EventEmitter2();
  const mock = sinon.mock(eventEmitter);
  mock.expects("emit").withArgs("viewer.loginPrompt");
  mock.expects("emit").withArgs("viewer.showAuthPopup", { view });
  await commit(environment, { view }, { eventEmitter });
  mock.verify();
});

it("emits only ShowAuthPopupEvent on other views", async () => {
  const view = "FORGOT_PASSWORD";
  const eventEmitter = new EventEmitter2();
  const mock = sinon.mock(eventEmitter);
  mock.expects("emit").withArgs("viewer.showAuthPopup", { view });
  await commit(environment, { view }, { eventEmitter });
  mock.verify();
});

it("opens popup or focus if already open", async () => {
  const view = "SIGN_IN";
  const context = {
    eventEmitter: new EventEmitter2(),
  };
  await commit(environment, { view }, context);
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(false);
  expect(source.get(AUTH_POPUP_ID)!.view).toEqual("SIGN_IN");

  await commit(environment, { view }, context);
  expect(source.get(AUTH_POPUP_ID)!.open).toEqual(true);
  expect(source.get(AUTH_POPUP_ID)!.focus).toEqual(true);
});
