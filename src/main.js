import TripPlannerPresenter, {
  siteContainerElement,
} from './presenter/tripPresenter.js';

const tripPlannerPresenter = new TripPlannerPresenter({
  TripPlannerContainer: siteContainerElement,
});

tripPlannerPresenter.init();
