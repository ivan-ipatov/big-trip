import AbstractView from '../framework/view/abstract-view';

/**
 * Creates HTML template for empty list view
 * @param {string} text - Text to display in empty list message
 * @returns {string} HTML template string
 */
const createEmptyListTemplate = (text) => (
  `<p class="trip-events__msg">${text}</p>`
);

/**
 * View class for displaying empty list state
 * @extends AbstractView
 */
class EmptyListView extends AbstractView {
  /** @type {string} */
  #text;

  /**
   * @param {Object} params - Constructor parameters
   * @param {string} params.text - Text to display in empty list message
   */
  constructor({text}) {
    super();
    this.#text = text;
  }

  /**
   * Returns HTML template for the view
   * @returns {string} HTML template string
   */
  get template() {
    return createEmptyListTemplate(this.#text);
  }
}

export default EmptyListView;
