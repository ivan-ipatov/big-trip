import { render, RenderPosition } from '../render.js';

import CreationFormView from '../view/formCreate.js';
import SortingView from '../view/sort.js';
import FilterView from '../view/filter.js';
import EditingFormView from '../view/formEdit.js';
import StartingPointView from '../view/startingPoint.js';
import StartingPointListView from '../view/startPointList.js';
import TripInfoView from '../view/tripInfo.js';

const header = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const tripMain = header.querySelector('.trip-main');
const siteContainerElement = siteMainElement.querySelector(
  '.page-body__container'
);

export default class TripPlannerPresenter {
  listComponent = new StartingPointListView();
  constructor({ TripPlannerContainer }) {
    this.TripPlannerContainer = TripPlannerContainer;
  }

  init() {
    render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
    render(new FilterView(), tripMain, RenderPosition.BEFOREEND);
    render(new SortingView(), this.TripPlannerContainer);
    render(this.listComponent, this.TripPlannerContainer);

    render(new EditingFormView(), this.listComponent.getElement());
    render(new CreationFormView(), this.listComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new StartingPointView(), this.listComponent.getElement());
    }
  }
}

export { TripPlannerPresenter, siteContainerElement };
