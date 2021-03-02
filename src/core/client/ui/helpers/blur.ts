/** blur removes focus from current active element */
export default function blur(window: Window) {
  if (window.document.activeElement) {
    (window.document.activeElement as any).blur();
  }
}
