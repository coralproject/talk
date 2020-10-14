/**
 * COUNT_SELECTOR is a css selector used to identify elements that
 * will be replaced by the story count.
 */
export const COUNT_SELECTOR = ".coral-count";

/**
 * ORIGIN_FALLBACK_ID can be attached to any <script /> tag as an
 * id or class to allow the `count.js` script to find its origin when
 * `document.currentScript` is not available (for legacy browsers).
 */
export const ORIGIN_FALLBACK_ID = "coral-script";

/**
 * ANNOUNCEMENT_DISMISSED_KEY is the localStorage key to store the ID of the
 * most recently dismissed announcement
 */
export const ANNOUNCEMENT_DISMISSED_KEY = "coral:lastAnnouncementDismissed";
