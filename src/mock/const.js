const CITIES = [
  {
    cityName: 'New York',
    description: 'This bustling metropolis is a melting pot of cultures, where every street corner offers a unique flavor and a story waiting to be discovered.'
  },
  {
    cityName: 'Los Angeles',
    description: 'Known for its entertainment industry, Los Angeles boasts beautiful beaches, palm trees, and a vibrant art scene, making it a hub for creativity and innovation.'
  },
  {
    cityName: 'Chicago',
    description: 'Famous for its stunning architecture and deep-dish pizza, Chicago offers a rich blend of cultural attractions, including world-class museums and theaters.'
  },
  {
    cityName: 'Houston',
    description: 'As the fourth largest city in the United States, Houston is known for its space exploration contributions, diverse culinary scene, and vibrant arts community.'
  },
  {
    cityName: 'Phoenix',
    description: 'With its warm climate and stunning desert landscapes, Phoenix is a go-to destination for outdoor enthusiasts and those seeking a unique southwestern experience.'
  },
  {
    cityName: 'Philadelphia',
    description: 'Philadelphia, the birthplace of America, is steeped in history with landmarks like the Liberty Bell and Independence Hall, offering a glimpse into the nations past.'
  },
  {
    cityName: 'San Antonio',
    description: 'Home to the famous Alamo, San Antonio combines rich history with a vibrant culture and excellent Tex-Mex cuisine, making it a popular destination.'
  },
  {
    cityName: 'San Diego',
    description: 'Famous for its beautiful beaches, warm climate, and stunning coastline, San Diego is a laid-back city perfect for outdoor activities and family fun.'
  },
  {
    cityName: 'Dallas',
    description: 'Known for its modern skyline and cultural institutions, Dallas is a major city in Texas known for its historical significance and vibrant business scene.'
  },
  {
    cityName: 'San Francisco',
    description: 'With its iconic Golden Gate Bridge and colorful Victorian houses, San Francisco is renowned for its scenic beauty, cultural diversity, and tech innovation.'
  }
];
const PRICE = {
  MIN: 1,
  MAX: 1000
};
const HOUR = {
  MIN: 0,
  MAX: 23
};
const MINUTES = {
  MIN: 0,
  MAX: 59
};
const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FLATPICKR_CONFIG = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  locale: {
    firstDayOfWeek: 1,
  },
  'time_24hr': true,
};
const UserAction = {
  UPDATE_POINT:'UPDATE_POINT',
  ADD_POINT:'ADD_POINT',
  DELETE_POINT:'DELETE_POINT',
};
const UpdateType = {
  PATCH:'PATCH',
  MINOR:'MINOR',
  MAJOR:'MAJOR',
};
const FilterType = {
  EVERYTHING:'everything',
  FUTURE:'future',
  PRESENT:'present',
  PAST:'past',
};
export { PRICE, CITIES, HOUR, MINUTES, POINT_TYPES, FLATPICKR_CONFIG,UserAction,UpdateType,FilterType};
