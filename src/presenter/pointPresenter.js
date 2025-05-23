import { render, replace, remove } from '../framework/render';
import StartingPointView from '../view/startingPoint';
import EditingFormView from '../view/formEdit';
import { UserAction, UpdateType } from '../mock/const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #listComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #mode = Mode.DEFAULT;
  #isPointSaving = true;
  #isEventEditing = false;
  #isOtherFormOpen = false;
  #offers = null;
  #point = null;
  #destinations = null;
  constructor({ listComponent, onDataChange, onModeChange }) {

    this.#listComponent = listComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, destinations, offers) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    this.#pointComponent = new StartingPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onButtonClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#pointEditComponent = new EditingFormView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: async () => this.#replaceFormToCard(),
      onFormHide: this.#handleHideForm,
      onDeleteClick: this.#handleDeleteClick,
    });


    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#listComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }
    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#isOtherFormOpen = true;
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {

    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#handleModeChange().then(() => {
      replace(this.#pointEditComponent, this.#pointComponent);
    });

    this.#mode = Mode.EDITING;
    this.#isEventEditing = true;
  }

  async #replaceFormToCard() {
    const updatedPoint = this.#pointEditComponent.parseStateTo(this.#pointEditComponent._state);
    const updatedDestination = this.#pointEditComponent.destinations;
    const updatedOffers = this.#pointEditComponent.offers;
    this.#point = updatedPoint;
    if (!this.#isOtherFormOpen && this.#isPointSaving) {
      await this.#handleDataChange(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        updatedPoint,
        updatedDestination,
        updatedOffers
      );
    }

    this.#isPointSaving = true;
    this.#isOtherFormOpen = false;

    // this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPoint);
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#isEventEditing = false;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH,
      update,);
    this.#replaceFormToCard();
  };

  #handleHideForm = () => {
    this.#replaceFormToCard();
  };

  #handleDeleteClick = async (point) => {
    await this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
    this.destroy();
  };


}
