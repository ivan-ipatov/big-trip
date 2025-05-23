import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

function createTripRouteTemplate(points, destinations) {
  if (!points.length) {
    return '';
  }

  const destinationNames = points.map((point) => {
    const destination = destinations.find((dest) => dest.id === point.destination);
    return destination ? destination.name : '';
  });

  if (destinationNames.length <= 3) {
    return destinationNames.join(' &mdash; ');
  }

  return `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
}

function createTripDatesTemplate(points) {
  if (!points.length) {
    return '';
  }

  const startDate = dayjs(points[0].startDate);
  const endDate = dayjs(points[points.length - 1].endDate);

  const formatDate = (date) => date.format('MMM D');

  if (startDate.month() === endDate.month()) {
    return `${formatDate(startDate)}&nbsp;&mdash;&nbsp;${endDate.date()}`;
  }

  return `${formatDate(startDate)}&nbsp;&mdash;&nbsp;${formatDate(endDate)}`;
}

function createTripPriceTemplate(points) {
  if (!points.length) {
    return '';
  }

  const totalPrice = points.reduce((sum, point) => {
    const pointPrice = point.basePrice;
    const offersPrice = point.offers.reduce((offerSum, offer) => offerSum + offer.price, 0);
    return sum + pointPrice + offersPrice;
  }, 0);

  return `&euro;&nbsp;${totalPrice}`;
}

function createTripInfoTemplate(points, destinations) {
  if (!points.length) {
    return '';
  }

  return `
    <div class="trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${createTripRouteTemplate(points, destinations)}</h1>
        <p class="trip-info__dates">${createTripDatesTemplate(points)}</p>
      </div>
      <p class="trip-info__cost">
        Total: ${createTripPriceTemplate(points)}
      </p>
    </div>
  `;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;

  constructor({points, destinations}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations);
  }
}

