import { getRandomPoint } from '../mock/point.js';
import Observable from '../framework/observable.js';

const POINT_COUNT = 5;

export default class PointsModel extends Observable {
  #points = Array.from({ length: POINT_COUNT }, getRandomPoint);

  get points() {
    return this.#points;
  }

  set points(points){
    this.#points = points;
  }

  updatePoint(updatedType,update){
    const index = this.#points.findIndex((point)=>point.id === update.id);

    if(index === -1){
      throw new Error('Can\' update unexisting point');
    }

    this.#points = [
      ...this.#points.splice(index, 1, update),
    ];

    this._notify(updatedType,update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updatedType,update){
    const index = this.#points.findIndex((point)=>point.id === update.id);
    if(index === -1){
      throw new Error('Can\' delete unexisting point');
    }

    this.#points = [
      ...this.#points.splice(index, 1),
    ];

    this._notify(updatedType);

  }
}
