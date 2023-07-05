export default function createUUIDGenerator() {
  let counter = 0;
  return () => `uuid-${counter++}`;
}
