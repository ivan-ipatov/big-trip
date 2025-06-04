import Observable from '../framework/observable.js';

/**
 * Model class for managing destinations data
 * @extends Observable
 */
class DestinationsModel extends Observable {
  /** @type {Object} Service for handling API requests related to events */
  #eventsApiService = null;

  /** @type {Array} Array of destination objects */
  #destinations = [];

  /**
   * Creates an instance of DestinationsModel
   * @param {Object} params - Constructor parameters
   * @param {Object} params.eventsApiService - Service for handling API requests
   */
  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  /**
   * Gets the list of destinations
   * @returns {Array} Array of destination objects
   */
  get destinations() {
    return this.#destinations;
  }

  /**
   * Initializes the destinations model by fetching data from the API
   * @returns {Promise<Error|void>} Returns an error if the initialization fails
   */
  async init() {
    try {
      this.#destinations = await this.#eventsApiService.destinations;
    } catch (err) {
      return err;
    }
  }
}

export default DestinationsModel;
