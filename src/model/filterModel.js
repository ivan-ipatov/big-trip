import { FilterTypes } from '../const.js';
import Observable from '../framework/observable.js';

/**
 * Model for managing filter state
 * @extends Observable
 */
class FilterModel extends Observable {
  #filter = FilterTypes.EVERYTHING;

  /**
   * Get current filter value
   * @returns {string} Current filter type
   */
  get filter() {
    return this.#filter;
  }

  /**
   * Update filter and notify observers
   * @param {string} updateType - Type of update
   * @param {string} filter - New filter value
   */
  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}

export default FilterModel;
