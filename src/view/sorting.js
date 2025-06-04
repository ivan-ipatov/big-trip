import { SortTypes } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

/**
 * Creates HTML template for a single sort item
 * @param {string} sortType - The type of sorting
 * @param {string} checkedType - Currently selected sort type
 * @returns {string} HTML template for sort item
 */
const createSortItemTemplate = (sortType, checkedType) => {
  const isDisabled = sortType === SortTypes.EVENT || sortType === SortTypes.OFFER;
  const labelText = sortType === SortTypes.OFFER ? 'Offers' : sortType;
  const isChecked = sortType === checkedType;

  return `
    <div class="trip-sort__item trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType}"
        data-sort-type="${sortType}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${labelText}</label>
    </div>
  `;
};

/**
 * Creates the main sorting template
 * @param {string} checkedType - Currently selected sort type
 * @returns {string} Complete HTML template for sorting form
 */
const createSortingTemplate = (checkedType) => {
  const sortItems = Object.values(SortTypes)
    .map((item) => createSortItemTemplate(item, checkedType))
    .join('');

  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sortItems}
    </form>
  `;
};

/**
 * View class for handling trip sorting functionality
 * @extends AbstractView
 */
class SortingView extends AbstractView {
  /** @type {Function} */
  #handleSortBtnClick;

  /** @type {string} */
  #currentSortType;

  /**
   * @param {Object} params - Constructor parameters
   * @param {Function} params.onSortChange - Callback function for sort change
   * @param {string} params.currentSortType - Currently selected sort type
   */
  constructor({ onSortChange, currentSortType }) {
    super();
    this.#handleSortBtnClick = onSortChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortBtnClickHandler);
  }

  /**
   * Returns the template for the sorting view
   * @returns {string} HTML template
   */
  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  /**
   * Handles click events on sort buttons
   * @param {Event} evt - Click event
   */
  #sortBtnClickHandler = (evt) => {
    this.#handleSortBtnClick(evt);
  };
}

export default SortingView;
