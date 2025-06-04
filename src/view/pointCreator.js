import { DateFormats, EVENT_TYPES } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { escapeHtml } from '../utils.js';

/**
 * @typedef {Object} Point
 * @property {number} price - Price of the point
 * @property {string} dateFrom - Start date of the point
 * @property {string} dateTo - End date of the point
 * @property {string} destination - Destination ID
 * @property {boolean} isFavorite - Whether the point is marked as favorite
 * @property {Array<string>} offers - Array of selected offer IDs
 * @property {string} type - Type of the point
 * @property {boolean} [isSaving] - Whether the point is being saved
 */

/**
 * @typedef {Object} Offer
 * @property {string} id - Offer ID
 * @property {string} title - Offer title
 * @property {number} price - Offer price
 */

/**
 * @typedef {Object} Destination
 * @property {string} id - Destination ID
 * @property {string} name - Destination name
 * @property {string} description - Destination description
 * @property {Array<{src: string, description: string}>} pictures - Array of destination pictures
 */

/**
 * Default template for a new point
 * @type {Point}
 */
const DEFAULT_POINT_TEMPLATE = {
  price: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

/**
 * Creates HTML template for point types selection
 * @param {string} selectedType - Currently selected point type
 * @returns {string} HTML template string
 */
const createPointTypesTemplate = (selectedType) => (
  EVENT_TYPES.map((eventType) => (
    `<div class="event__type-item">
      <input
        id="event-type-${eventType}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${eventType === selectedType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>`
  )).join('')
);

/**
 * Creates HTML template for available offers
 * @param {Object} pointTypeOffers - Offers for specific point type
 * @param {Array<string>} selectedOffers - Array of selected offer IDs
 * @returns {string} HTML template string
 */
const createAvailableOffersTemplate = (pointTypeOffers, selectedOffers) => (
  pointTypeOffers.offers.map((offer) => (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offer.title}-${offer.id}"
        type="checkbox"
        name="event-offer-${offer.title}"
        data-id="${offer.id}"
        ${selectedOffers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  )).join('')
);

/**
 * Creates HTML template for offers section
 * @param {Array<Object>} allOffers - All available offers
 * @param {Array<string>} selectedOffers - Array of selected offer IDs
 * @param {string} pointType - Type of the point
 * @returns {string} HTML template string
 */
const createOffersSectionTemplate = (allOffers, selectedOffers, pointType) => {
  const pointTypeOffers = allOffers.find((offer) => offer.type === pointType);
  if (!pointTypeOffers?.offers.length) {
    return '';
  }
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createAvailableOffersTemplate(pointTypeOffers, selectedOffers)}
      </div>
    </section>`
  );
};

/**
 * Creates HTML template for destination section
 * @param {Destination} destinationInfo - Information about the destination
 * @returns {string} HTML template string
 */
const createDestinationSectionTemplate = (destinationInfo) => {
  if (!destinationInfo || (!destinationInfo.description && !destinationInfo.pictures.length)) {
    return '';
  }
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo.description}</p>
      ${destinationInfo.pictures.length ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destinationInfo.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('')}
          </div>
        </div>
      ` : ''}
    </section>`
  );
};

/**
 * Creates HTML template for the add point form
 * @param {Point} point - Point data
 * @param {Array<Object>} allOffers - All available offers
 * @param {Array<Destination>} destinations - All available destinations
 * @returns {string} HTML template string
 */
const createAddPointFormTemplate = (point, allOffers, destinations) => {
  const {price, dateFrom, dateTo, destination, offers, type, isSaving} = point;
  const destinationInfo = destinations.find((item) => item.id === destination);
  const destinationsList = destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createPointTypesTemplate(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo ? escapeHtml(destinationInfo.name) : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsList}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${createOffersSectionTemplate(allOffers, offers, type)}
          ${createDestinationSectionTemplate(destinationInfo)}
        </section>
      </form>
    </li>`
  );
};

/**
 * View class for creating new points
 * @extends AbstractStatefulView
 */
class AddPointView extends AbstractStatefulView {
  /** @type {Array<Offer>} */
  #offers;
  /** @type {Array<Destination>} */
  #destinations;
  /** @type {Function} */
  #handleFormSubmit;
  /** @type {Function} */
  #handleFormReset;
  /** @type {Object} */
  #dateFromDatepicker;
  /** @type {Object} */
  #dateToDatepicker;

  /**
   * Creates an instance of AddPointView
   * @param {Object} params - Constructor parameters
   * @param {Array<Offer>} params.offers - Available offers
   * @param {Array<Destination>} params.destinations - Available destinations
   * @param {Function} params.onFormSubmit - Form submit handler
   * @param {Function} params.onFormReset - Form reset handler
   */
  constructor({offers, destinations, onFormSubmit, onFormReset}) {
    super();
    this._setState({...DEFAULT_POINT_TEMPLATE, isSaving: false});
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onFormReset;

    this._restoreHandlers();
  }

  /**
   * Returns the HTML template for the view
   * @returns {string} HTML template
   */
  get template() {
    return createAddPointFormTemplate(this._state, this.#offers, this.#destinations);
  }

  /**
   * Removes element and cleans up datepickers
   */
  removeElement() {
    super.removeElement();

    if (this.#dateFromDatepicker) {
      this.#dateFromDatepicker.destroy();
      this.#dateFromDatepicker = null;
    }
    if (this.#dateToDatepicker) {
      this.#dateToDatepicker.destroy();
      this.#dateToDatepicker = null;
    }
  }

  /**
   * Restores event handlers
   * @private
   */
  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formResetHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#pointTypeChangeHandler);
    const offersContainer = this.element.querySelector('.event__available-offers');
    if (offersContainer) {
      offersContainer.addEventListener('click', this.#offersChangeHandler);
    }
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);

    this.#setDatepickers();
  }

  /**
   * Sets up datepickers for date inputs
   * @private
   */
  #setDatepickers() {
    this.#dateFromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: DateFormats.FULL_DATE,
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom || '',
        minDate: 'today',
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler
      },
    );

    this.#dateToDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: DateFormats.FULL_DATE,
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo || '',
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      },
    );
  }

  /** @private */
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    delete this._state.isSaving;
    this.#handleFormSubmit(this._state);
  };

  /** @private */
  #formResetHandler = () => {
    this.#handleFormReset();
  };

  /** @private */
  #pointTypeChangeHandler = (evt) => {
    if (evt.target.closest('input')) {
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  /** @private */
  #offersChangeHandler = (evt) => {
    if (evt.target.checked) {
      this._setState({
        offers: [...this._state.offers, evt.target.dataset.id]
      });
    }
  };

  /** @private */
  #destinationChangeHandler = (evt) => {
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    this.updateElement({
      destination: newDestination.id
    });
  };

  /** @private */
  #priceInputHandler = (evt) => {
    this._setState({
      price: parseInt(evt.target.value, 10)
    });
  };

  /** @private */
  #dateFromChangeHandler = ([date]) => {
    this._setState({
      dateFrom: date
    });
  };

  /** @private */
  #dateToChangeHandler = ([date]) => {
    this._setState({
      dateTo: date
    });
  };
}

export default AddPointView;
