import { FilterType } from '../mock/const';

import dayjs from 'dayjs';
const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.startDate) > dayjs()),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.startDate) <= dayjs() && dayjs(point.endDate) >= dayjs()),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs((point.endDate)) < dayjs()),
};


export {filter};
