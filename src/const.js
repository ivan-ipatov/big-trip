/**
 * Available event types in the application
 * @type {string[]}
 */
const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

/**
 * Authorization token for API requests
 * @type {string}
 */
const AUTHORIZATION = 'Basic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ10';

/**
 * API endpoint URL
 * @type {string}
 */
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

/**
 * @typedef {Object} DateFormats
 * @property {string} MONTH - Format for month display (e.g., "MMM D")
 * @property {string} TIME - Format for time display (e.g., "HH:mm")
 * @property {string} FULL_DATE - Format for full date display (e.g., "d/m/y H:i")
 * @property {string} TOTAL_MONTH - Format for total month display (e.g., "D MMM")
 */
const DateFormats = {
  MONTH: 'MMM D',
  TIME: 'HH:mm',
  FULL_DATE: 'd/m/y H:i',
  TOTAL_MONTH: 'D MMM'
};

/**
 * @typedef {Object} FilterTypes
 * @property {string} EVERYTHING - Filter for all events
 * @property {string} FUTURE - Filter for future events
 * @property {string} PRESENT - Filter for present events
 * @property {string} PAST - Filter for past events
 */
const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

/**
 * @typedef {Object} SortTypes
 * @property {string} DAY - Sort by day
 * @property {string} EVENT - Sort by event type
 * @property {string} TIME - Sort by time
 * @property {string} PRICE - Sort by price
 * @property {string} OFFER - Sort by offer
 */
const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

/**
 * @typedef {Object} UserAction
 * @property {string} UPDATE_EVENT - Action for updating an event
 * @property {string} ADD_EVENT - Action for adding a new event
 * @property {string} DELETE_EVENT - Action for deleting an event
 */
const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

/**
 * @typedef {Object} UpdateType
 * @property {string} PATCH - Minor update type
 * @property {string} MINOR - Minor update type
 * @property {string} MAJOR - Major update type
 * @property {string} INIT - Initial update type
 * @property {string} ERROR - Error update type
 */
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

/**
 * @typedef {Object} Method
 * @property {string} GET - HTTP GET method
 * @property {string} PUT - HTTP PUT method
 * @property {string} POST - HTTP POST method
 * @property {string} DELETE - HTTP DELETE method
 */
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

/**
 * @typedef {Object} TimeLimit
 * @property {number} LOWER_LIMIT - Lower time limit in milliseconds
 * @property {number} UPPER_LIMIT - Upper time limit in milliseconds
 */
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};


/**
 * Text messages displayed when no events are available for each filter type
 * @type {Object.<string, string>}
 */
const NoEventsTexts = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PAST]: 'There are no past events now',
  [FilterTypes.PRESENT]: 'There are no present events now'
};

export {
  EVENT_TYPES,
  DateFormats,
  FilterTypes,
  SortTypes,
  UserAction,
  UpdateType,
  NoEventsTexts,
  Method,
  AUTHORIZATION,
  END_POINT,
  TimeLimit
};
