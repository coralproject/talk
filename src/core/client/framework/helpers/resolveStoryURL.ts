import { getLocationOrigin } from "coral-framework/utils";

function resolveStoryURL() {
  const canonical = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement;
  if (canonical) {
    return canonical.href;
  }

  // eslint-disable-next-line no-console
  console.warn(
    "This page does not include a canonical link tag. Coral has inferred this story_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages."
  );

  // ensure that urls are encoded properly and lowercase
  let pathname = window.location.pathname
  // if the pathname is already encoded, decode it
  // this keeps percent escapes uppercase
  if(pathname !== decodeURIComponent(pathname || '')){
    pathname = decodeURI(pathname)
  }
  // first make the path lowercase and then encode it again
  pathname = pathname.toLowerCase()
  pathname = encodeURI(pathname)

  return getLocationOrigin() + pathname;
}

export default resolveStoryURL;
