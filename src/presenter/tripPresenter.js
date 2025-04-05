import { RenderPosition } from '../render.js';
import { render, replace } from '../framework/render.js';
import CreationFormView from '../view/formCreate.js';
import SortingView from '../view/sort.js';
import FilterView from '../view/filter.js';
import EditingFormView from '../view/formEdit.js';
import StartingPointView from '../view/startingPoint.js';
import StartingPointListView from '../view/startPointList.js';
import TripInfoView from '../view/tripInfo.js';

const header = document.querySelector('.page-header');
const tripMain = header.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const siteContainerElement = siteMainElement.querySelector(
  '.page-body__container'
);

export default class TripPlannerPresenter {
  #TripPlannerContainer = null;
  #pointModel = null;

  constructor({ TripPlannerContainer, pointModel }) {
    this.#TripPlannerContainer = TripPlannerContainer;
    this.#pointModel = pointModel;
  }

  #listComponent = new StartingPointListView();

  init() {
    this.points = [...this.#pointModel.points];

    render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
    render(new FilterView(), tripMain, RenderPosition.BEFOREEND);
    render(new SortingView(), this.#TripPlannerContainer);
    render(this.#listComponent, this.#TripPlannerContainer);
    render(new CreationFormView(), this.#listComponent.element);
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });

  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const pointComponent = new StartingPointView({
      point, onButtonClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const pointEditComponent = new EditingFormView({
      point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }, onButtonClick: () => {
        replaceFormToCard();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }
    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }
    render(pointComponent, this.#listComponent.element);
  }

}

export { TripPlannerPresenter, siteContainerElement };
