import { remove, render, RenderPosition } from '../framework/render.js';
import EditingFormView from '../view/formEdit';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../mock/const.js';

export default class NewPointPresenter {
  #listComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #offers = null;
  #destinations = null;
  #point = null;
  #pointEditComponent = null;

  constructor({ listComponent, onDataChange, onDestroy }) {
    this.#listComponent = listComponent;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

  }

  init(point, offers, destinations) {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#pointEditComponent = new EditingFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCloseClick: this.#resetButtonClick,
    });

    render(this.#pointEditComponent, this.#listComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {

    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { ...point, id: nanoid() },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #resetButtonClick = () => {
    this.destroy();
  };
}
