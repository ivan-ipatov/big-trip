import { FilterType } from '../mock/const';
import dayjs from 'dayjs';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.startDate) > Date.now()),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.startDate) < Date.now() && dayjs(point.endDate) > Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs((point.endDate)) < Date.now()),
};

export {filter};
