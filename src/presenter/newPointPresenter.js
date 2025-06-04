import { UpdateType, UserAction } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import AddPointView from '../view/pointCreator';

/**
 * Presenter class for handling new point creation functionality
 */
class NewPointPresenter {
  /** @type {HTMLElement} */
  #container;

  /** @type {Array} */
  #offers;

  /** @type {Array} */
  #destinations;

  /** @type {Function} */
  #onDataChange;

  /** @type {Function} */
  #onResetForm;

  /** @type {AddPointView} */
  #addPointFormComponent;

  /**
   * Creates an instance of NewPointPresenter
   * @param {Object} params - Constructor parameters
   * @param {HTMLElement} params.container - Container element for rendering
   * @param {Array} params.offers - Available offers
   * @param {Array} params.destinations - Available destinations
   * @param {Function} params.onDataChange - Callback for data changes
   * @param {Function} params.onResetForm - Callback for form reset
   */
  constructor({ container, offers, destinations, onDataChange, onResetForm }) {
    this.#container = container;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onDataChange = onDataChange;
    this.#onResetForm = onResetForm;
  }

  /**
   * Initializes the presenter and renders the add point form
   */
  init() {
    this.#addPointFormComponent = new AddPointView({
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onFormReset: this.#closeAddPointForm,
    });
    render(this.#addPointFormComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  /**
   * Destroys the presenter and cleans up resources
   */
  destroy() {
    this.#closeAddPointForm();
  }

  /**
   * Sets the saving state of the form
   */
  setSaving() {
    this.#addPointFormComponent.updateElement({
      isSaving: true
    });
  }

  /**
   * Sets the aborting state of the form and handles error animation
   */
  setAborting() {
    const resetFormState = () => {
      this.#addPointFormComponent.updateElement({
        isSaving: false
      });
    };

    this.#addPointFormComponent.shake(resetFormState);
  }

  /**
   * Closes the add point form and triggers reset callback
   * @private
   */
  #closeAddPointForm = () => {
    remove(this.#addPointFormComponent);
    this.#onResetForm();
  };

  /**
   * Handles form submission
   * @param {Object} point - Point data to be added
   * @private
   */
  #handleFormSubmit = (point) => {
    this.#onDataChange(UserAction.ADD_EVENT, UpdateType.MAJOR, point);
  };
}

export default NewPointPresenter;
