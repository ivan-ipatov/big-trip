import AbstractView from '../framework/view/abstract-view';

/**
 * Creates HTML template for the new event button
 * @returns {string} HTML template string
 */
const createNewEventTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

/**
 * View class for the new event button component
 * @extends AbstractView
 */
class NewEventView extends AbstractView {
  /** @type {Function} */
  #handleBtnClick;

  /**
   * Creates an instance of NewEventView
   * @param {Object} options - Configuration options
   * @param {Function} options.onBtnClick - Callback function for button click
   */
  constructor({onBtnClick}) {
    super();
    this.#handleBtnClick = onBtnClick;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  /**
   * Returns the HTML template for the view
   * @returns {string} HTML template
   */
  get template() {
    return createNewEventTemplate();
  }

  /**
   * Handles button click event
   * @param {Event} evt - Click event object
   * @private
   */
  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnClick();
  };
}

export default NewEventView;
