import Observable from '../framework/observable.js';
import { UpdateType } from '../mock/const.js';

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService = null;

  constructor({ pointsApiService }) {
    super();

    this.#pointsApiService = pointsApiService;

  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch (err) {

      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updatedType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\' update unexisting point');
    }

    const response = await this.#pointsApiService.updatePoint(update);
    const updatedPoint = this.#adaptToClient(response);
    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updatedType, update);

  }

  async addPoint(updateType, update) {
    const response = await this.#pointsApiService.addPoint(update);
    const newPoint = this.#adaptToClient(response);
    this.#points = [newPoint, ...this.#points];
    this._notify(updateType, newPoint);
  }

  async deletePoint(updatedType, update) {
    await this.#pointsApiService.deletePoint(update);
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\' delete unexisting point');
    }
    this.#points.splice(index, 1);
    this._notify(updatedType);
  }

  #adaptToClient(point) {
    const adaptedTask = {
      ...point,
      startDate: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      endDate: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      destinationID: point['destination'],
      price: point['base_price'],
      isFavorite: point['is_favorite'],
    };
    delete adaptedTask['date_from'];
    delete adaptedTask['date_to'];
    delete adaptedTask['destination'];
    delete adaptedTask['base_price'];
    delete adaptedTask['is_favorite'];

    return adaptedTask;
  }
}
