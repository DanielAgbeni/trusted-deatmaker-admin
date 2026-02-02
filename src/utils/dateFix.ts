export default function fixDateFormat(originalDate: string): string {
  // Try to parse the original date
  const parsedDate = new Date(originalDate || Date.now());

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1; // Months are zero-based
  const day = parsedDate.getDate();

  // Create the fixed date string with zero-padding
  const fixedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  return fixedDate;
}
