export default function getHost(url: string) {
  const split = url.split("/");
  return split[2];
}
