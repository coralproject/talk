/** blur removes focus from current active element */
export default function blur() {
  if (window.document.activeElement) {
    (window.document.activeElement as any).blur();
  }
}
