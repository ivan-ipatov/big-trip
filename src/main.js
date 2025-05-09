import {
  TripPlannerPresenter,
  siteContainerElement
} from './presenter/tripPresenter.js';
import PointsModel from './model/pointModel.js';
import FilterModel from './model/filterModel.js';
import FilterPresenter from './presenter/filterPresenter.js';
const filterContainer = document.querySelector('.trip-controls__filters');
const pointModel = new PointsModel();
const filterModel = new FilterModel();
const tripPlannerPresenter = new TripPlannerPresenter({
  TripPlannerContainer: siteContainerElement, filterModel,pointModel
});
const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointModel
});
filterPresenter.init();
tripPlannerPresenter.init();
