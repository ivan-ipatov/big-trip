import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  async updatePoint(update) {
    const response = await this._load({
      url: `points/${update.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(update)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  async addPoint(update) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(update),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'date_from': point.startDate instanceof Date ? point.startDate.toISOString() : null,
      'date_to': point.endDate instanceof Date ? point.endDate.toISOString() : null,
      'destination': point.destinationID,
      'base_price': point.price,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.startDate;
    delete adaptedPoint.endDate;
    delete adaptedPoint.destinationID;
    delete adaptedPoint.price;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
