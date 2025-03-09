import { getRandomArrayElement } from '../utils/random.js';
import { CITIES } from './const.js';


const mockDestinations = [
  {
    'id': 1,
    ...getRandomArrayElement(CITIES),
    'photos': [
      `https://loremflickr.com/300/200?random=${crypto.randomUUID()}`,
    ]
  },
  {
    'id': 2,
    ...getRandomArrayElement(CITIES),
    'photos': [
      `https://loremflickr.com/300/200?random=${crypto.randomUUID()}`,
    ]
  },
  {
    'id': 3,
    ...getRandomArrayElement(CITIES),
    'photos': [
      `https://loremflickr.com/300/200?random=${crypto.randomUUID()}`,
    ]
  },
  {
    'id': 4,
    ...getRandomArrayElement(CITIES),
    'photos': [
      `https://loremflickr.com/300/200?random=${crypto.randomUUID()}`,
    ]
  }
];

export { mockDestinations };
