/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/unbound-method */
import sinon from "sinon";

export default function mockWindow() {
  const originalClose = window.close;
  const originalResizeTo = window.resizeTo;
  const closeStub = sinon.stub();
  const resizeStub = sinon.stub();
  window.close = closeStub;
  window.resizeTo = resizeStub;
  return {
    closeStub,
    resizeStub,
    restore: () => {
      window.close = originalClose;
      window.resizeTo = originalResizeTo;
    },
  };
}
