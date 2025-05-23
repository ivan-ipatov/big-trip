import {RenderPosition} from '../render.js';
import {remove, render} from '../framework/render.js';
import CreationFormView from '../view/formCreate';
import SortingView from '../view/sort';
import {filter} from '../utils/filter.js';
import StartingPointListView from '../view/startPointList';
import TripInfoView from '../view/tripInfo';
import PointPresenter from './pointPresenter';
import {FilterType, UpdateType, UserAction} from '../mock/const.js';
import NoPointView from '../view/noPointView.js';
import NewPointPresenter from './newPointPresenter';
import LoadingView from '../view/loading';

const POINT_COUNT_PER_STEP = 5;
const header = document.querySelector('.page-header');
const tripMain = header.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteContainerElement = siteMainElement.querySelector(
  '.page-body__container'
);

export default class TripPlannerPresenter {
  #TripPlannerContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #sortComponent = new SortingView();
  #tripInfoView = new TripInfoView();
  #filterModel = null;
  #noPointComponent = null;
  #creationForm = new CreationFormView();
  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;

  #filterType = FilterType.EVERYTHING;
  #listComponent = new StartingPointListView();
  constructor({ TripPlannerContainer, pointsModel, filterModel, onNewPointDestroy, destinationsModel, offersModel, }) {
    this.#TripPlannerContainer = TripPlannerContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#newPointPresenter = new NewPointPresenter({
      listComponent: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    return filter[this.#filterType](points);
  }

  init() {
    this.#renderTrip();
  }

  createPoint() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    const pointCount = this.points.length;
    const points = this.points.slice(0, Math.min(pointCount, this.#renderedPointCount));
    points.forEach((point) => this.#newPointPresenter.init(point, this.destinations, this.offers));

  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
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


  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listComponent: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, this.destinations, this.offers,);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points, destinations, offers) {
    points.forEach((point) => this.#renderPoint(point, destinations, offers));
    if (this.points.length === 0) {
      this.#renderNoPoints();
    }
  }

  #handleModeChange = async () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updatedType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        await this.#pointsModel.updatePoint(updatedType, update);
        break;
      case UserAction.DELETE_POINT:
        await this.#pointsModel.deletePoint(updatedType, update);
        break;
      case UserAction.ADD_POINT:
        await this.#pointsModel.addPoint(updatedType, update);
        break;
    }
  };

  #handleModelEvent = (updatedType, data) => {
    switch (updatedType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearTripPlan();
        this.#renderTrip(this.events, this.destinations, this.offers);
        break;
      case UpdateType.MAJOR:
        this.#clearTripPlan();
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip(this.events, this.destinations, this.offers);
        break;
    }
  };

  #clearTripPlan({ resetRenderedPointCount = false } = {}) {
    const pointCount = this.points.length;
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#loadingComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    if (resetRenderedPointCount) {
      this.#renderedPointCount = POINT_COUNT_PER_STEP;
    } else {

      this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
    }

  }

  #renderLoading() {
    render(this.#loadingComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderTrip() {
    const points = this.points;
    this.#renderTripInfo();
    this.#renderSort();
    this.#renderWaypointList();
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderPoints(points);
  }
}

export { TripPlannerPresenter, siteContainerElement, tripMain };
