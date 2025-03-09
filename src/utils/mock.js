import { mockDestinations } from '../mock/destination';
import { mockOffers } from '../mock/offers';

function getDestinationById(point) {
  return mockDestinations.find((destination) => destination.id === point.destinationID);
}
function getOffersByType(point) {
  return mockOffers.find((offer) => offer.type === point.type).offers;
}

export { getOffersByType, getDestinationById };
