import { DateFormats, EVENT_TYPES } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { escapeHtml } from '../utils.js';

/**
 * Creates HTML template for point type selection
 * @param {string} type - Current point type
 * @returns {string} HTML template string
 */
const createPointTypesTemplate = (type) => EVENT_TYPES.map((eventType) => (
  `<div class="event__type-item">
    <input
      id="event-type-${eventType}-1"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${eventType}"
      ${eventType === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
  </div>`
)).join('');

/**
 * Creates HTML template for available offers
 * @param {Object} pointTypeOffers - Offers for current point type
 * @param {Array<number>} offers - Selected offer IDs
 * @returns {string} HTML template string
 */
const createAvaliableOffersTemplate = (pointTypeOffers, offers) => pointTypeOffers.offers.map((offer) => (
  `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.title}-${offer.id}"
      type="checkbox"
      name="event-offer-${offer.title}"
      data-id="${offer.id}"
      ${offers.includes(offer.id) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`
)).join('');

/**
 * Creates HTML template for offers section
 * @param {Object} pointTypeOffers - Offers for current point type
 * @param {Array<number>} offers - Selected offer IDs
 * @returns {string} HTML template string
 */
const createOffersSectionTemplate = (pointTypeOffers, offers) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createAvaliableOffersTemplate(pointTypeOffers, offers)}
    </div>
  </section>`
);

/**
 * Creates HTML template for destination section
 * @param {Object} destinationInfo - Destination information
 * @returns {string} HTML template string
 */
const createDestinationSectionTemplate = (destinationInfo) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationInfo.description}</p>
    ${destinationInfo.pictures.length === 0 ? '' : `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destinationInfo.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('')}
        </div>
      </div>
    `}
  </section>`
);

/**
 * Creates HTML template for edit point form
 * @param {Object} point - Point data
 * @param {Array<Object>} allOffers - All available offers
 * @param {Array<Object>} destinations - All available destinations
 * @returns {string} HTML template string
 */
const createEditPointFormTemplate = (point, allOffers, destinations) => {
  const {price, dateFrom, dateTo, destination, offers, type, isSaving, isDeleting} = point;
  const pointTypeOffers = allOffers.find((offer) => offer.type === type);
  const destinationInfo = destinations.find((item) => item.id === destination);
  const renderDestinationsList = destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');

  return `<li class="trip-events__item">
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${escapeHtml(destinationInfo.name)}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${renderDestinationsList}
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
        <button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${pointTypeOffers.offers.length === 0 ? '' : createOffersSectionTemplate(pointTypeOffers, offers)}
        ${destinationInfo.description || destinationInfo.pictures.length !== 0 ? createDestinationSectionTemplate(destinationInfo) : ''}
      </section>
    </form>
  </li>`;
};

/**
 * View class for editing a point
 * @extends AbstractStatefulView
 */
class EditPointView extends AbstractStatefulView {
  /** @type {Array<Object>} */
  #offers = null;
  /** @type {Array<Object>} */
  #destinations = null;
  /** @type {Function} */
  #handleFormSubmit = null;
  /** @type {Function} */
  #handleFormReset = null;
  /** @type {Function} */
  #handleDeleteBtnClick = null;
  /** @type {Object} */
  #dateFromDatepicker = null;
  /** @type {Object} */
  #dateToDatepicker = null;

  /**
   * @param {Object} params - Constructor parameters
   * @param {Object} params.point - Point data
   * @param {Array<Object>} params.offers - Available offers
   * @param {Array<Object>} params.destinations - Available destinations
   * @param {Function} params.onFormSubmit - Form submit handler
   * @param {Function} params.onFormReset - Form reset handler
   * @param {Function} params.onDeleteClick - Delete button click handler
   */
  constructor({point, offers, destinations, onFormSubmit, onFormReset, onDeleteClick}) {
    super();
    this._setState({...point, isSaving: false, isDeleting: false});
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onFormReset;
    this.#handleDeleteBtnClick = onDeleteClick;

    this._restoreHandlers();
  }

  /**
   * @returns {string} HTML template
   */
  get template() {
    return createEditPointFormTemplate(this._state, this.#offers, this.#destinations);
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
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deletePointHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formResetHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#pointTypeChangeHandler);
    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersChangeHandler);
    }
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);

    this.#setDatepickers();
  }

  /**
   * Resets view with new point data
   * @param {Object} point - New point data
   */
  reset(point) {
    this.updateElement(point);
  }

  /**
   * Sets up datepickers
   * @private
   */
  #setDatepickers() {
    this.#dateFromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: DateFormats.FULL_DATE,
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
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
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      },
    );
  }

  /** @private */
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    delete this._state.isDeleting;
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
    const offerId = evt.target.dataset.id;

    if (evt.target.checked) {
      this._setState({
        offers: [...this._state.offers, offerId]
      });
    } else {
      this._setState({
        offers: this._state.offers.filter((id) => id !== offerId)
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
    this.updateElement({
      dateFrom: date
    });
  };

  /** @private */
  #dateToChangeHandler = ([date]) => {
    this.updateElement({
      dateTo: date
    });
  };

  /** @private */
  #deletePointHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteBtnClick(this._state);
  };
}

export default EditPointView;
