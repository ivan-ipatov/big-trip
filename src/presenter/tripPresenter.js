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
  constructor({ TripPlannerContainer, pointModel }) {
    this.TripPlannerContainer = TripPlannerContainer;
    this.pointModel = pointModel;
  }

  init() {
    this.points = [...this.pointModel.getPoints()];

    render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
    render(new FilterView(), tripMain, RenderPosition.BEFOREEND);
    render(new SortingView(), this.TripPlannerContainer);
    render(this.listComponent, this.TripPlannerContainer);
    render(new EditingFormView({ point: this.points[0] }), this.listComponent.getElement());
    render(new CreationFormView(), this.listComponent.getElement());
    this.points.forEach((point) => {
      render(new StartingPointView({ point: point }), this.listComponent.getElement());
    });

  }
}

export { TripPlannerPresenter, siteContainerElement };
