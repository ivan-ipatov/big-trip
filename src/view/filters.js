import AbstractView from '../framework/view/abstract-view.js';
import { filter } from '../utils.js';

/**
 * Creates HTML template for a single filter item
 * @param {Object} filterInfo - Filter information object
 * @param {string} filterInfo.type - Type of the filter
 * @param {number} filterInfo.count - Number of points for this filter
 * @param {string} currentFilter - Currently selected filter type
 * @returns {string} HTML template string for filter item
 */
const createFilterItemTemplate = (filterInfo, currentFilter) => {
  const { type, count } = filterInfo;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}"
            class="trip-filters__filter-input  visually-hidden"
            type="radio"
            name="trip-filter"
            value="${type}"
            ${type === currentFilter ? 'checked' : ''}
            ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `;
};

/**
 * Creates HTML template for the entire filters form
 * @param {Array<Object>} filters - Array of filter objects
 * @param {string} currentFilter - Currently selected filter type
 * @returns {string} HTML template string for filters form
 */
const createFilterTemplate = (filters, currentFilter) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((item) => createFilterItemTemplate(item, currentFilter)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

/**
 * View class for trip filters
 * @extends AbstractView
 */
class FiltersView extends AbstractView {
  /** @type {Array} */
  #points;

  /** @type {string} */
  #currentFilter;

  /** @type {Function} */
  #handleFilterChange;

  /**
   * @param {Object} params - Constructor parameters
   * @param {Array} params.points - Array of trip points
   * @param {string} params.currentFilter - Currently selected filter type
   * @param {Function} params.onFilterChange - Callback function for filter change
   */
  constructor({ points, currentFilter, onFilterChange }) {
    super();
    this.#points = points;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#changeFilterHandler);
  }

  /**
   * Getter for the template
   * @returns {string} HTML template string
   */
  get template() {
    return createFilterTemplate(this.#generateFilters(), this.#currentFilter);
  }

  /**
   * Generates filter objects with counts
   * @private
   * @returns {Array<Object>} Array of filter objects with type and count
   */
  #generateFilters() {
    return Object.entries(filter).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        count: filterPoints(this.#points).length,
      }),
    );
  }

  /**
   * Handles filter change event
   * @private
   * @param {Event} evt - Change event object
   */
  #changeFilterHandler = (evt) => {
    this.#handleFilterChange(evt.target.value);
  };
}


export default FiltersView;
