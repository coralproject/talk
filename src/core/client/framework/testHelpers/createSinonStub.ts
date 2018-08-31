import sinon, { SinonStub } from "sinon";

export default function createSinonStub(
  ...callbacks: Array<(s: SinonStub) => void>
): SinonStub {
  const stub = sinon.stub();
  callbacks.forEach(cb => cb(stub));
  return stub;
}
