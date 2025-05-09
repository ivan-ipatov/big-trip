import { RenderPosition } from '../render.js';
import { render } from '../framework/render.js';
import CreationFormView from '../view/formCreate.js';
import SortingView from '../view/sort.js';
import FilterView from '../view/filter.js';
import StartPointListView from '../view/startPointList.js';
import TripInfoView from '../view/tripInfo.js';
import PointPresenter from './point-presenter.js';
import { updatePointData } from '../utils/dataBind.js';

const header = document.querySelector('.page-header');
const tripMain = header.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteContainerElement = siteMainElement.querySelector(
  '.page-body__container'
);

export default class TripPlannerPresenter {
  #TripPlannerContainer = null;
  #pointModel = null;
  #sortComponent = new SortingView();
  #tripInfoView = new TripInfoView();
  #filterView = new FilterView();
  #creationForm = new CreationFormView();
  #pointPresenters = new Map();
  #points = [];
  constructor({ TripPlannerContainer, pointModel }) {
    this.#TripPlannerContainer = TripPlannerContainer;
    this.#pointModel = pointModel;
  }

  #listComponent = new StartPointListView();

  init() {
    this.#points = [...this.#pointModel.points];
    this.#renderTrip();
  }


  #renderCreationForm() {
    render(this.#creationForm, this.#listComponent.element);
  }

  #renderWaypointList() {
    render(this.#listComponent, this.#TripPlannerContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#TripPlannerContainer);
  }

  #renderTripInfo() {
    render(this.#tripInfoView, tripMain, RenderPosition.AFTERBEGIN);
  }

  #renderFilter() {
    render(this.#filterView, tripMain, RenderPosition.BEFOREEND);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listComponent: this.#listComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updatePointData(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderTrip() {
    this.#renderTripInfo();
    this.#renderSort();
    this.#renderFilter();
    this.#renderWaypointList();
    this.#renderCreationForm();
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }
}

export { TripPlannerPresenter, siteContainerElement };
