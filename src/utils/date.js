import dayjs from 'dayjs';
import { getRandomInt } from './random';

const WAYPOINT_DATE_FORMAT = 'DD MMM HH:mm';

const EDITING_FORM_DATE_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDate(date) {
  return date ? dayjs(date).format(WAYPOINT_DATE_FORMAT) : ' ';
}
function humanizeEditingFormDate(date) {
  return date ? dayjs(date).format(EDITING_FORM_DATE_FORMAT) : ' ';
}
function addNull(timePart) {
  if (timePart.toString().length === 1) {
    timePart = `0${timePart}`;
    return timePart;
  } return timePart;
}

function getDate() {
  const day = getRandomInt(1, 31);
  const month = getRandomInt(1, 12);

  return `${addNull(month)}-${addNull(day)}`;
}

function getDateDifference(startDate, endDate) {
  const dateDifferenceInMinutes = dayjs(endDate).diff(dayjs(startDate), 'minute');
  const dateDifferenceInHours = dayjs(endDate).diff(dayjs(startDate), 'hour');
  const days = Math.floor(dateDifferenceInHours / 24);
  const hours = Math.floor(dateDifferenceInMinutes / 60) - days * 24;
  const minutes = dateDifferenceInMinutes % 60;

  let result = '';

  if (dateDifferenceInHours > 24) {
    result += `${days}D `;
  }

  if (dateDifferenceInHours > 0) {
    result += `${hours}H `;
  }

  if (dateDifferenceInMinutes >= 60 || (result === '' && minutes > 0)) {
    result += `${minutes}M`;
  }

  return result.trim();
}

function getRandomStartDate(date, startHour, startMinutes) {
  return `2025-${date} ${addNull(startHour)}:${addNull(startMinutes)}`;
}

function getRandomEndDate(date, startHour, startMinutes, MINUTES) {
  return `2025-${date} ${addNull(getRandomInt(startHour + 1, 23))}:${addNull(getRandomInt(startMinutes + 1, MINUTES.MAX))}`;
}

export { getDateDifference, getDate, humanizeEditingFormDate, humanizePointDate, addNull, getRandomStartDate, getRandomEndDate };
