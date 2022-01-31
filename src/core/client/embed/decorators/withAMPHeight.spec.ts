import Sinon from "sinon";
import withAMPHeight from "./withAMPHeight";

it("should listen to height", () => {
  const fakeEventEmitter = {
    on: Sinon.stub().callsFake((type: string, callback: () => void) => {
      expect(type).toBe("heightChange");
      callback();
    }),
  };
  withAMPHeight(fakeEventEmitter as any);
  expect(fakeEventEmitter.on.called).toBe(true);
});
