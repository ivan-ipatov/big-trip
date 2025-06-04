import Observable from '../framework/observable.js';

/**
 * Model class for managing offers data
 * @extends Observable
 */
class OffersModel extends Observable {
  /** @type {import('../services/events-api-service').default} */
  #eventsApiService;

  /** @type {Array<import('../types/offer').default>} */
  #offers = [];

  /**
   * Creates an instance of OffersModel
   * @param {Object} params - Constructor parameters
   * @param {import('../services/events-api-service').default} params.eventsApiService - Service for API calls
   */
  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  /**
   * Getter for offers array
   * @returns {Array<import('../types/offer').default>} Array of offers
   */
  get offers() {
    return this.#offers;
  }

  /**
   * Initializes the model by fetching offers from the API
   * @returns {Promise<void>}
   */
  async init() {
    try {
      this.#offers = await this.#eventsApiService.offers;
    } catch (err) {
      return err;
    }
  }
}

export default OffersModel;
