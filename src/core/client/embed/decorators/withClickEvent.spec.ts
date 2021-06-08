import simulant from "simulant";
import sinon from "sinon";

import { CleanupCallback } from "./";
import withClickEvent from "./withClickEvent";

it("should send click events", () => {
  const pymMock = {
    sendMessage: sinon.mock().once().withArgs("click", ""),
  };
  const cleanup = withClickEvent(
    pymMock as any,
    null as any
  ) as CleanupCallback;
  simulant.fire(document.body, "click");
  cleanup();
  simulant.fire(document.body, "click");
  pymMock.sendMessage.verify();
});
