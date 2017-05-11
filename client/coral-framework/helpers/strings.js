export function capitalize(str) {
  const newString = new String(str);
  return newString.charAt(0).toUpperCase() + newString.slice(1);
}
