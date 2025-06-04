import { Method } from './const.js';
import ApiService from './framework/api-service.js';

/**
 * Service class for handling events API operations
 * @extends {ApiService}
 */
class Api extends ApiService {
  /**
   * Converts point data from client format to server format
   * @private
   * @param {Object} point - Point data in client format
   * @returns {Object} Point data in server format
   */
  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.price,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.price;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  /**
   * Fetches all events from the server
   * @returns {Promise<Array>} Promise resolving to array of events
   */
  get events() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  /**
   * Fetches all destinations from the server
   * @returns {Promise<Array>} Promise resolving to array of destinations
   */
  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  /**
   * Fetches all offers from the server
   * @returns {Promise<Array>} Promise resolving to array of offers
   */
  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  /**
   * Updates an existing event on the server
   * @param {Object} point - Event data to update
   * @returns {Promise<Object>} Promise resolving to updated event data
   */
  async updateEvent(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return ApiService.parseResponse(response);
  }

  /**
   * Creates a new event on the server
   * @param {Object} point - Event data to create
   * @returns {Promise<Object>} Promise resolving to created event data
   */
  async addEvent(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return ApiService.parseResponse(response);
  }

  /**
   * Deletes an event from the server
   * @param {Object} point - Event to delete
   * @returns {Promise<Response>} Promise resolving to server response
   */
  async deleteEvent(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }
}

export default Api;
