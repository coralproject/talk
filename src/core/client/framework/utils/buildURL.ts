export default function buildURL({
  protocol = window.location.protocol,
  hostname = window.location.hostname,
  port = window.location.port,
  pathname = window.location.pathname,
  search = window.location.search,
  hash = window.location.hash,
} = {}) {
  if (search && !search.startsWith("?")) {
    search = `?${search}`;
  } else if (search === "?") {
    search = "";
  }
  return `${protocol}//${hostname}${
    port ? `:${port}` : ""
  }${pathname}${search}${hash}`;
}
