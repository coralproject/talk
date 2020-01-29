export default function parseURL(url: string) {
  const parser = document.createElement("a");
  parser.href = url;
  return {
    protocol: parser.protocol,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    hash: parser.hash,
  };
}
