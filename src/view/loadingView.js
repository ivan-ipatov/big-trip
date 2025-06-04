import AbstractView from '../framework/view/abstract-view';

/**
 * Creates HTML template for loading state
 * @returns {string} HTML template string
 */
const createLoadingTemplate = () => '<p class="trip-events__msg">Loading...</p>';

/**
 * View class for displaying loading state
 * @extends AbstractView
 */
class LoadingView extends AbstractView {
  /**
   * Returns the template for the loading view
   * @returns {string} HTML template string
   */
  get template() {
    return createLoadingTemplate();
  }
}

export default LoadingView;
