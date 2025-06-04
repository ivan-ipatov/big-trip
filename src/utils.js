import dayjs from 'dayjs';
import { FilterTypes, SortTypes } from './const.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';

// Constants
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;
const MIN_DAYS_IN_MONTH = 29;

// Initialize dayjs plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);

/**
 * Formats a date according to the specified format
 * @param {string|Date} date - The date to format
 * @param {string} dateFormat - The format string to use
 * @returns {string} The formatted date string or empty string if date is falsy
 */
const formatDate = (date, dateFormat) => date ? dayjs(date).format(dateFormat) : '';

/**
 * Calculates the duration between two dates
 * @param {string|Date} startDate - The start date
 * @param {string|Date} endDate - The end date
 * @param {boolean} [inMilliseconds=false] - Whether to return duration in milliseconds
 * @returns {string|number} Formatted duration string or milliseconds if inMilliseconds is true
 */
const calculateDuration = (startDate, endDate, inMilliseconds = false) => {
  const timeDuration = dayjs(endDate).diff(startDate);
  if (inMilliseconds) {
    return timeDuration;
  }
  let timeFormat = 'DD[D] HH[H] mm[M]';
  if (timeDuration < MS_IN_DAY) {
    timeFormat = 'HH[H] mm[M]';
  }
  if (timeDuration < MS_IN_HOUR) {
    timeFormat = 'mm[M]';
  }

  return Math.floor(dayjs.duration(timeDuration).asDays()) > MIN_DAYS_IN_MONTH
    ? `${Math.floor(dayjs.duration(timeDuration).asDays())}D ${dayjs.duration(timeDuration).format('HH[H] mm[M]')}`
    : dayjs.duration(timeDuration).format(timeFormat);
};

/**
 * Checks if the pressed key is Escape
 * @param {KeyboardEvent} evt - The keyboard event
 * @returns {boolean} True if the pressed key is Escape
 */
const isEscapeKey = (evt) => evt.key === 'Escape';

/**
 * Escapes HTML special characters in a string
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
const escapeHtml = (str) => {
  if (!str) {
    return '';
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Filter functions for different filter types
 * @type {Object}
 */
const filter = {
  [FilterTypes.EVERYTHING]: (events) => events,
  [FilterTypes.FUTURE]: (events) => events.filter((event) => dayjs().isBefore(dayjs(event.dateFrom))),
  [FilterTypes.PRESENT]: (events) => events.filter((event) =>
    dayjs().isSameOrAfter(dayjs(event.dateFrom)) && dayjs().isSameOrBefore(dayjs(event.dateTo))),
  [FilterTypes.PAST]: (events) => events.filter((event) => dayjs().isAfter(dayjs(event.dateTo)))
};

/**
 * Sort functions for different sort types
 * @type {Object}
 */
const sort = {
  [SortTypes.DAY]: (points) => points.sort((first, second) => dayjs(first.dateFrom).diff(dayjs(second.dateFrom))),
  [SortTypes.PRICE]: (points) => points.sort((first, second) => second.price - first.price),
  [SortTypes.TIME]: (points) => points.sort((first, second) =>
    calculateDuration(second.dateFrom, second.dateTo, true) - calculateDuration(first.dateFrom, first.dateTo, true))
};

export {
  formatDate,
  calculateDuration,
  filter,
  isEscapeKey,
  sort,
  escapeHtml
};
