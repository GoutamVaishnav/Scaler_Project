import { addMinutes } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

export function getTodayInTimezone(timezone) {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}

export function localDateTimeToUtc(dateString, minuteOfDay, timezone) {
  const hours = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  const localDateTime = `${dateString}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  return fromZonedTime(localDateTime, timezone);
}

export function formatDateTimeRange(startDate, endDate, timezone) {
  const start = formatInTimeZone(startDate, timezone, "EEE, MMM d, yyyy h:mm a");
  const end = formatInTimeZone(endDate, timezone, "h:mm a zzz");
  return `${start} - ${end}`;
}

export function formatDateInTimezone(date, timezone, pattern = "yyyy-MM-dd") {
  return formatInTimeZone(date, timezone, pattern);
}

export function startOfTimezoneDay(dateString, timezone) {
  return fromZonedTime(`${dateString}T00:00:00`, timezone);
}

export function endOfTimezoneDay(dateString, timezone) {
  return fromZonedTime(`${dateString}T23:59:59`, timezone);
}

export function addMinutesUtc(date, minutes) {
  return addMinutes(date, minutes);
}

export function utcToTimezoneDate(date, timezone) {
  return toZonedTime(date, timezone);
}
