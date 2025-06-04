import AbstractView from '../framework/view/abstract-view.js';
import { formatDate, calculateDuration } from '../utils.js';
import { DateFormats } from '../const.js';
import { escapeHtml } from '../utils.js';

/**
 * Creates HTML template for a point event
 * @param {Object} point - Point data object
 * @param {number} point.price - Price of the point
 * @param {string} point.dateFrom - Start date
 * @param {string} point.dateTo - End date
 * @param {boolean} point.isFavorite - Favorite status
 * @param {string} point.destination - Destination ID
 * @param {string[]} point.offers - Selected offer IDs
 * @param {string} point.type - Event type
 * @param {Array} allOffers - All available offers
 * @param {Array} destinations - All available destinations
 * @returns {string} HTML template string
 */
const createPointTemplate = (point, allOffers, destinations) => {
  const { price, dateFrom, dateTo, isFavorite, destination, offers, type } = point;
  const offersForEventType = allOffers.find((offer) => offer.type === type);
  const destinationInfo = destinations.find((dest) => dest.id === destination);

  const selectedOffers = offersForEventType.offers
    .filter((offer) => offers.includes(offer.id))
    .map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `).join('');

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${formatDate(dateFrom, DateFormats.MONTH)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${escapeHtml(destinationInfo.name)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${formatDate(dateFrom, DateFormats.TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${formatDate(dateTo, DateFormats.TIME)}</time>
          </p>
          <p class="event__duration">${calculateDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffers}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

/**
 * View class for rendering a single point event
 * @extends AbstractView
 */
class EventView extends AbstractView {
  /** @type {Object} */
  #point;
  /** @type {Array} */
  #offers;
  /** @type {Array} */
  #destinations;
  /** @type {Function} */
  #handleEditBtnClick;
  /** @type {Function} */
  #handleFavoriteBtnClick;

  /**
   * @param {Object} params - Constructor parameters
   * @param {Object} params.point - Point data
   * @param {Array} params.offers - Available offers
   * @param {Array} params.destinations - Available destinations
   * @param {Function} params.onEditBtnClick - Edit button click handler
   * @param {Function} params.onFavoriteClick - Favorite button click handler
   */
  constructor({ point, offers, destinations, onEditBtnClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditBtnClick = onEditBtnClick;
    this.#handleFavoriteBtnClick = onFavoriteClick;

    this.#initEventListeners();
  }

  /**
   * Initialize event listeners for the view
   * @private
   */
  #initEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  /**
   * Get the HTML template for the view
   * @returns {string} HTML template
   */
  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  /**
   * Handle edit button click
   * @private
   */
  #editClickHandler = () => {
    this.#handleEditBtnClick();
  };

  /**
   * Handle favorite button click
   * @private
   */
  #favoriteClickHandler = () => {
    this.#handleFavoriteBtnClick();
  };
}

export default EventView;
