import { render, replace, remove } from '../framework/render';
import StartingPoint from '../view/startingPoint';
import EditingFormView from '../view/formEdit';


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
  #point = null;
  constructor({ listComponent, onDataChange, onModeChange }) {
    this.#listComponent = listComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new StartingPoint({
      point: this.#point,
      onButtonClick: this.#handleEditClick,
      onFavoriteClick: this.#onHandleFavoriteClick,
    });
    this.#pointEditComponent = new EditingFormView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onFormHide: this.#handleHideForm,
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

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;

  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #onHandleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToCard();
  };

  #handleHideForm = () => {
    this.#replaceFormToCard();
    // document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
