import { getLocationOrigin } from "coral-framework/utils";

function resolveStoryURL(window: Window) {
  const canonical = window.document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement;
  if (canonical) {
    return canonical.href;
  }

  // eslint-disable-next-line no-console
  console.warn(
    "This page does not include a canonical link tag. Coral has inferred this story_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages."
  );

  return getLocationOrigin(window) + window.location.pathname;
}

export default resolveStoryURL;
