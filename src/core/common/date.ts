export function createDateFormatter(
  locales: string[] | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }
) {
  return new Intl.DateTimeFormat(locales, options);
}

export function formatDate(date: Date, locales: string[]) {
  const formatter = createDateFormatter(locales);
  const formattedDate = formatter.format(date);

  return formattedDate;
}
