import {RenderPosition} from '../render.js';
import {remove, render} from '../framework/render.js';
import CreationFormView from '../view/formCreate.js';
import SortingView from '../view/sort.js';
import {filter} from '../utils/filter.js';
import StartingPointListView from '../view/startPointList.js';
import TripInfoView from '../view/tripInfo.js';
import PointPresenter from './pointPresenter.js';
import {FilterType, UpdateType, UserAction} from '../mock/const.js';
import NoPointView from '../view/noPointView.js';

const POINT_COUNT_PER_STEP = 8;
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
  #filterModel = null;
  #noPointComponent = null;
  #creationForm = new CreationFormView();
  #renderedPointCount = POINT_COUNT_PER_STEP;
  #pointPresenters = new Map();
  #filterType = FilterType.EVERYTHING;
  constructor({ TripPlannerContainer, pointModel,filterModel }) {
    this.#TripPlannerContainer = TripPlannerContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #listComponent = new StartingPointListView();

  get points(){
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    return filter[this.#filterType](points);
  }

  init() {
    this.#renderTrip();
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
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points){
    points.forEach((point)=>this.#renderPoint(point));
    if (this.points.length === 0) {
      this.#renderNoPoints();

    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType,updatedType,update) => {
    switch(actionType){
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updatedType,update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updatedType,update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updatedType,update);
        break;
    }
  };

  #handleModelEvent = (updatedType,data)=>{
    switch(updatedType){
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripPlan();
        this.#renderTrip();
        break;
    }
  };

  #clearTripPlan(){
    const pointCount = this.points.length;

    this.#pointPresenters.forEach((presenter)=> presenter.destroy());
    this.#pointPresenters.clear();
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    this.#renderedPointCount = Math.min(pointCount, this.#renderedPointCount);
  }

  #renderTrip() {
    const points = this.points;
    const pointCount = points.length;
    this.#renderTripInfo();
    this.#renderSort();

    this.#renderWaypointList();

    this.#renderPoints(points.slice(0,Math.min(pointCount, this.#renderedPointCount)));
  }
}

export { TripPlannerPresenter, siteContainerElement,tripMain };
