import sinon, { SinonStub } from "sinon";

/**
 * createSinonStub assist in setting up a stub with different
 * return paths.
 *
 * e.g.
 * ```
 * const s = sinon.stub();
 * s.throws();
 * s.withArgs("a").returns(0);
 * s.withArgs("b").returns(1);
 * ```
 * is equivalent to.
 * ```
 * const s = createSinonStub(
 *   s => s.throws(),
 *   s => s.withArgs("a").returns(0),
 *   s => s.withArgs("b").returns(1),
 * );
 * ```
 */
export default function createSinonStub(
  ...callbacks: Array<(s: SinonStub) => void>
): SinonStub {
  const stub = sinon.stub();
  callbacks.forEach((cb) => cb(stub));
  return stub;
}
