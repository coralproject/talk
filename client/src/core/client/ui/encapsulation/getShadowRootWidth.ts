/**
 * getShadowRootWidth returns the width of the shadow root's first Child.
 */
export default function getShadowRootWidth(shadowRoot: ShadowRoot) {
  const node = shadowRoot.firstChild!;
  if (!node) {
    return null;
  }
  const rect = (node as HTMLElement).getBoundingClientRect();
  return rect.right - rect.left;
}
