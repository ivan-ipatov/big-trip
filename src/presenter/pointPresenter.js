import EventView from '../view/point.js';
import EventEditorView from '../view/pointEditor.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import { UpdateType, UserAction } from '../const.js';

/**
 * @enum {string}
 */
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

/**
 * Presenter class for managing point events in the application
 */
class PointPresenter {
  /** @type {EventView|null} */
  #pointComponent = null;
  /** @type {EventEditorView|null} */
  #pointEditComponent = null;
  /** @type {EventEditorView|null} */
  #newPointFormComponent = null;
  /** @type {Object|null} */
  #point = null;
  /** @type {HTMLElement} */
  #pointsContainer = null;
  /** @type {Array} */
  #offers = [];
  /** @type {Array} */
  #destinations = [];
  /** @type {Function} */
  #handleDataChange = null;
  /** @type {Function} */
  #handleModeChange = null;
  /** @type {string} */
  #mode = Mode.DEFAULT;

  /**
   * @param {Object} params - Constructor parameters
   * @param {HTMLElement} params.pointsContainer - Container for points
   * @param {Array} params.offers - Available offers
   * @param {Array} params.destinations - Available destinations
   * @param {Function} params.onDataChange - Callback for data changes
   * @param {Function} params.onModeChange - Callback for mode changes
   * @param {EventEditorView} params.newPointFormComponent - Component for new point form
   */
  constructor({pointsContainer, offers, destinations, onDataChange, onModeChange, newPointFormComponent}) {
    this.#pointsContainer = pointsContainer;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#newPointFormComponent = newPointFormComponent;
  }

  /**
   * Initializes the point presenter with a new point
   * @param {Object} point - Point data to initialize with
   */
  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new EventView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditBtnClick: this.#editBtnClickHandler,
      onFavoriteClick: this.#favoriteBtnClickHandler,
    });

    this.#pointEditComponent = new EventEditorView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#editFormSubmitHandler,
      onFormReset: this.#editFormResetHandler,
      onDeleteClick: this.#deletePointHandler
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  /**
   * Resets the form view to default state
   */
  resetFormView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  /**
   * Destroys the presenter and removes all components
   */
  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  /**
   * Sets the saving state for the edit form
   */
  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isSaving: true
      });
    }
  }

  /**
   * Sets the deleting state for the edit form
   */
  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDeleting: true
      });
    }
  }

  /**
   * Handles aborting operations with visual feedback
   */
  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  /**
   * Replaces point view with edit form
   * @private
   */
  #replacePointToEditForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escapeKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  /**
   * Replaces edit form with point view
   * @private
   */
  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  /**
   * Handles escape key press
   * @param {KeyboardEvent} evt - Keyboard event
   * @private
   */
  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escapeKeydownHandler);
    }
  };

  /**
   * Handles favorite button click
   * @private
   */
  #favoriteBtnClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  /**
   * Handles edit button click
   * @private
   */
  #editBtnClickHandler = () => {
    this.#replacePointToEditForm();
    if (this.#newPointFormComponent) {
      this.#newPointFormComponent.destroy();
    }
  };


  /**
   * Handles point deletion
   * @param {Object} point - Point to delete
   * @private
   */
  #deletePointHandler = (point) => {
    this.#handleDataChange(UserAction.DELETE_EVENT, UpdateType.MINOR, point);
  };

  /**
   * Handles edit form reset
   * @private
   */
  #editFormResetHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
  };

  /**
   * Handles edit form submission
   * @param {Object} point - Updated point data
   * @private
   */
  #editFormSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.UPDATE_EVENT, UpdateType.MINOR, point);
  };
}

export default PointPresenter;
