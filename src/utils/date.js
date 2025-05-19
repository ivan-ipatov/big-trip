import dayjs from 'dayjs';


const WAYPOINT_DATE_FORMAT = 'DD MMM HH:mm';

const EDITING_FORM_DATE_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDate(date) {
  return date ? dayjs(date).format(WAYPOINT_DATE_FORMAT) : ' ';
}
function humanizeEditingFormDate(date) {
  return date ? dayjs(date).format(EDITING_FORM_DATE_FORMAT) : ' ';
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

export { getDateDifference, humanizeEditingFormDate, humanizePointDate };
