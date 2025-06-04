import AbstractView from '../framework/view/abstract-view';

/**
 * Creates HTML template for failed load message
 * @returns {string} HTML template string
 */
const createFailedLoadTemplate = () => '<p class="trip-events__msg">Failed to load latest route information</p>';

/**
 * View class for displaying failed load message
 * @extends AbstractView
 */
class FailedLoadView extends AbstractView {
  /**
   * Returns the template for failed load message
   * @returns {string} HTML template string
   */
  get template() {
    return createFailedLoadTemplate();
  }
}

export default FailedLoadView;
