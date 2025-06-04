import AbstractView from '../framework/view/abstract-view.js';

/**
 * Creates HTML template for the events list container
 * @returns {string} HTML template string containing the events list container
 */
const createEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

/**
 * Class representing the events list view component
 * @extends AbstractView
 */
class EventsListView extends AbstractView {
  /**
   * Returns the template for the events list view
   * @returns {string} HTML template string
   */
  get template() {
    return createEventsListTemplate();
  }
}

export default EventsListView;
