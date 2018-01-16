export function buildUrl(
  { protocol, hostname, port, pathname, search, hash } = window.location
) {
  if (search && search[0] !== '?') {
    search = `?${search}`;
  } else if (search === '?') {
    search = '';
  }
  return `${protocol}//${hostname}${
    port ? `:${port}` : ''
  }${pathname}${search}${hash}`;
}
