import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDate, getDateDifference } from '../utils/date.js';
import { getDestinationById, getOffersByType } from '../utils/mock.js';


function createWaypointTemplate(point) {
  const { type, price, startDate, endDate, isFavorite } = point;
  const dateStart = humanizePointDate(startDate);
  const dateEnd = humanizePointDate(endDate);

  const destination = getDestinationById(point);

  const offers = getOffersByType(point);

  const selectedOffers = offers
    .filter((offer) => point.offers.includes(offer.id))
    .map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `)
    .join('');
  const isFavoriteEvt = isFavorite ? 'event__favorite-btn--active' : '';
  return ` <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${dateStart.slice(0, 7)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.cityName}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${dateStart.slice(7, 15)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="2019-03-18T11:00">${dateEnd.slice(7, 15)}</time>
                  </p>
                  <p class="event__duration">${getDateDifference(startDate, endDate)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                 ${selectedOffers}
                </ul>
                <button class="event__favorite-btn ${isFavoriteEvt}" type="button">
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
}

export default class StartingPoint extends AbstractView {
  #point = null;
  #handleEditClick = null;

  #handleFavouriteToggle = null;

  constructor({ point, onButtonClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#handleEditClick = onButtonClick;

    this.#handleFavouriteToggle = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createWaypointTemplate(this.#point);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavouriteToggle();
  };

}
