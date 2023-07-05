export default function isBeforeDate(date: string | number | Date) {
  return new Date() < new Date(date);
}
