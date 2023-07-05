/* eslint-disable no-restricted-globals */
import startsWith from "coral-common/utils/startsWith";

export default function buildURL({
  protocol = window.location.protocol,
  hostname = window.location.hostname,
  port = window.location.port,
  pathname = window.location.pathname,
  search = window.location.search,
  hash = window.location.hash,
} = {}) {
  if (search && !startsWith(search, "?")) {
    search = `?${search}`;
  } else if (search === "?") {
    search = "";
  }
  if (!startsWith(pathname, "/")) {
    pathname = "/" + pathname;
  }
  return `${protocol}//${hostname}${
    port ? `:${port}` : ""
  }${pathname}${search}${hash}`;
}
