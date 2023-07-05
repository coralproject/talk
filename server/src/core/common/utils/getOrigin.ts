export default function getOrigin(url: string) {
  const split = url.split("/");
  return `${split[0]}//${split[2]}`;
}
