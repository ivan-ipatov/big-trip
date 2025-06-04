import FilterView from '../view/filters.js';
import { remove, render } from '../framework/render.js';
import { UpdateType } from '../const.js';

/**
 * Presenter class for managing filters in the application
 * Handles the interaction between filter model and view
 */
class FilterPresenter {
  /** @type {Object} Model for managing events data */
  #eventsModel = null;
  /** @type {Object} Model for managing filter state */
  #filterModel = null;
  /** @type {HTMLElement} Container element for filter component */
  #container = null;
  /** @type {FilterView} Instance of filter view component */
  #view = null;

  /**
   * Creates an instance of FilterPresenter
   * @param {HTMLElement} container - Container element for filter component
   * @param {Object} eventsModel - Model for managing events data
   * @param {Object} filterModel - Model for managing filter state
   */
  constructor(container, eventsModel, filterModel) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#onModelChange);
    this.#filterModel.addObserver(this.#onModelChange);
  }

  /**
   * Initializes the filter presenter
   * Renders the initial filter view
   */
  init() {
    this.#renderView();
  }

  /**
   * Getter for events data
   * @returns {Array} Array of event points
   */
  get events() {
    return this.#eventsModel.events;
  }

  /**
   * Handles model changes
   * Re-renders filters when events or filter state changes
   * @private
   */
  #onModelChange = () => {
    this.#renderView();
  };

  /**
   * Handles filter change events
   * Updates the filter model with new filter type
   * @param {string} filterType - Type of filter to apply
   * @private
   */
  #onFilterChange = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  /**
   * Renders the filter component
   * Removes existing component if present and creates a new one
   * @private
   */
  #renderView() {
    if (this.#view) {
      remove(this.#view);
    }
    this.#view = new FilterView({
      points: this.events,
      currentFilter: this.#filterModel.filter,
      onFilterChange: this.#onFilterChange,
    });
    render(this.#view, this.#container);
  }
}

export default FilterPresenter;
