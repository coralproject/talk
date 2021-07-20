import sinon from "sinon";

import withConfig from "./withConfig";

it("should emit events from pym to Config", () => {
  const config = { accessToken: "token", bodyClassName: "custom" };
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      expect(type).toBe("getConfig");
      callback();
    },
    sendMessage: sinon
      .stub()
      .withArgs("config", JSON.stringify(config))
      .returns(null),
  };
  withConfig(config)(fakePym as any, null as any);
  expect(fakePym.sendMessage.calledOnce).toBe(true);
});
