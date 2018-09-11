import parse from 'url-parse';

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

export function buildCommentURL(assetURL, commentID) {
  const u = parse(assetURL, true);
  u.query.commentId = commentID;
  u.set('query', u.query);
  return u.href;
}
