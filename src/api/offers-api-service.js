import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class OffersApiService extends ApiService {

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  async updatePoint(offers) {
    const response = await this._load({
      url: `offers/${offers.id}`,
      method: Method.PUT,
      body: JSON.stringify(offers),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

}
