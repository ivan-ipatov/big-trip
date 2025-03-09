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
  const hours = Math.floor(dateDifferenceInMinutes / 60);
  const minutes = dateDifferenceInMinutes % 60;

  if (dateDifferenceInMinutes < 60) {
    return `${minutes}M`;
  } else if (minutes === 0) {
    return `${hours}H`;
  } else {
    return `${hours}H ${minutes}M`;
  }
}

function getRandomStartDate(date, startHour, startMinutes) {
  return `2019-${date} ${addNull(startHour)}:${addNull(startMinutes)}`;
}

function getRandomEndDate(date, startHour, startMinutes, MINUTES) {
  return `2019-${date} ${addNull(getRandomInt(startHour + 1, 23))}:${addNull(getRandomInt(startMinutes + 1, MINUTES.MAX))}`;
}
export { getDateDifference, getDate, humanizeEditingFormDate, humanizePointDate, addNull, getRandomStartDate, getRandomEndDate };
