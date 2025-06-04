import AbstractView from '../framework/view/abstract-view';
import { formatDate } from '../utils.js';
import { DateFormats } from '../const.js';

/** Maximum number of destinations to show in the header title */
const MAX_DESTINATIONS_TO_RENDER = 3;

/**
 * Creates HTML template for the header section
 * @param {Object} params - Parameters for template creation
 * @param {number} params.totalPrice - Total price of the trip
 * @param {string[]} params.destinationNames - Array of destination names
 * @param {Array<Object>} params.points - Array of trip points
 * @returns {string} HTML template string
 */
const createHeaderTemplate = ({totalPrice, destinationNames, points}) => {
  const destinations = Array.from(new Set(destinationNames));
  const title = destinations.length > MAX_DESTINATIONS_TO_RENDER
    ? `${destinations[0]} &mdash;...&mdash; ${destinations[destinations.length - 1]}`
    : destinations.join(' &mdash; ');

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${formatDate(points[0].dateFrom, DateFormats.TOTAL_MONTH)}&nbsp;&mdash;&nbsp;${formatDate(points[points.length - 1].dateTo, DateFormats.TOTAL_MONTH)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
};

/**
 * View class for rendering trip header
 * @extends AbstractView
 */
class HeaderView extends AbstractView {
  /** @type {Array<Object>} */
  #points;
  /** @type {Array<Object>} */
  #destinations;
  /** @type {Array<Object>} */
  #offers;

  /**
   * @param {Object} params - Constructor parameters
   * @param {Array<Object>} params.points - Array of trip points
   * @param {Array<Object>} params.destinations - Array of destinations
   * @param {Array<Object>} params.offers - Array of available offers
   */
  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  /**
   * Returns HTML template for the view
   * @returns {string} HTML template string
   */
  get template() {
    return createHeaderTemplate({
      totalPrice: this.#calculateTotalPrice(),
      destinationNames: this.#getDestinationNames(),
      points: this.#points
    });
  }

  /**
   * Calculates total price including points and offers
   * @private
   * @returns {number} Total price
   */
  #calculateTotalPrice() {
    const offersPrice = this.#points.reduce((total, point) =>
      total + this.#calculateCheckedOffersPrice(point.type, point.offers), 0);
    const pointsPrice = this.#points.reduce((total, point) => total + parseInt(point.price, 10), 0);
    return pointsPrice + offersPrice;
  }

  /**
   * Calculates price for checked offers of specific type
   * @private
   * @param {string} type - Offer type
   * @param {string[]} offersIds - Array of selected offer IDs
   * @returns {number} Total price of selected offers
   */
  #calculateCheckedOffersPrice(type, offersIds) {
    const offersForType = this.#offers.find((offer) => offer.type === type);
    return offersForType.offers
      .filter((offer) => offersIds.includes(offer.id))
      .reduce((total, offer) => total + offer.price, 0);
  }

  /**
   * Gets array of destination names for the trip
   * @private
   * @returns {string[]} Array of destination names
   */
  #getDestinationNames() {
    return this.#points.map((point) =>
      this.#destinations.find((dest) => dest.id === point.destination).name
    );
  }
}


export default HeaderView;
