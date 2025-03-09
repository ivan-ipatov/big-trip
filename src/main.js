import {
  TripPlannerPresenter,
  siteContainerElement,
} from './presenter/tripPresenter.js';
import PointsModel from './model/pointModel.js';

const pointModel = new PointsModel();
const tripPlannerPresenter = new TripPlannerPresenter({
  TripPlannerContainer: siteContainerElement, pointModel
});

tripPlannerPresenter.init();
