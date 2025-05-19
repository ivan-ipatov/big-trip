import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class DestinationsApiService extends ApiService {


  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }


  async updatePoint(destinations) {
    const response = await this._load({
      url: `destinations/${destinations.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(destinations)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  #adaptToServer(destinations) {
    const adaptedDestinations = {
      ...destinations,
      'name': destinations.cityName
    };

    delete adaptedDestinations.cityName;


    return adaptedDestinations;
  }
}
