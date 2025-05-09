import { humanizeEditingFormDate } from '../utils/date.js';
import { getDestinationById, getOffersByType, getDestinationByCityName, setSaveButtonDisabled } from '../utils/mock.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES,FLATPICKR_CONFIG } from '../mock/const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEditingFormTemplate(point) {
  const { type, price, startDate, endDate } = point;

  const dateStart = humanizeEditingFormDate(startDate);
  const dateEnd = humanizeEditingFormDate(endDate);
  const destination = getDestinationById(point);

  const offers = getOffersByType(point);

  const offersTemplate = offers
    .map((offer) => {
      const checked = point.offers.includes(offer.id) ? 'checked' : '';
      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-comfort" ${checked}>
        <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
    })
    .join('');
  const pointTypeTemplate = POINT_TYPES.map((pointType) => `
   <div class="event__type-item">
                          <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
                          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointType}</label>
                        </div>
  `).join('');
  return `
 <li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                      ${pointTypeTemplate}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.cityName}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      <option value="Los Angeles"></option>
                      <option value="">New York</option>
                      <option value="">Chicago</option>
                      <option value="">Houston</option>
                      <option value="">Phoenix</option>
                      <option value="">Philadelphia</option>
                      <option value="">San Antonio</option>
                      <option value="">San Diego</option>
                      <option value="">Dallas</option>
                      <option value="San Francisco"></option>

                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${offersTemplate}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                  </section>
                </section>
              </form>
            </li>
`;
}


export default class EditingFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #handleHideForm = null;


  constructor({point, onFormSubmit, onFormHide }) {
    super();
    this._setState({ ...point });

    this.#handleFormSubmit = onFormSubmit;

    this.#handleHideForm = onFormHide;

    this._restoreHandlers();
  }

  get template() {
    return createEditingFormTemplate(this._state);
  }

  removeElement() {
    super.removeElement();


    if(this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if(this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  reset(point) {
    this.updateElement(point);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetButtonClick);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('click', this.#typeChangeHandler);
    });

    this.element.querySelectorAll('.event__input--destination').forEach((input) => {
      input.addEventListener('change', this.#destinationChangeHandler);
    });
    this.element.querySelectorAll('.event__offer-checkbox').forEach((input) => {
      input.addEventListener('click', this.#offersChangeHandler);
    });
    this.element.querySelectorAll('.event__input--price').forEach((input) => {
      input.addEventListener('change', this.#priceChangeHandler);
    });
    this.#setDatepickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #resetButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleHideForm();
  };


  #typeChangeHandler = (evt) => {
    const target = evt.target;

    const pointType = target.value;

    this.updateElement({
      type: pointType,
      offers: []
    });

  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const cityName = evt.target.value;

    const destination = getDestinationByCityName(cityName);
    if (destination) {
      this.updateElement({
        destinationID: destination.id
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #offersChangeHandler = (evt) => {
    const offerId = Number(evt.target.id);
    this.updateElement({
      offers: this._state.offers.includes(offerId) ? this._state.offers.filter((id) => id !== offerId) : [...this._state.offers, offerId]
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const pointPrice = evt.target.value;

    if (pointPrice > 0) {
      this.updateElement({
        price: pointPrice
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #closeDateStartHandler = ([date]) => {
    if (date <= this._state.endDate) {
      this.updateElement({
        startDate: date,
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #closeDateEndHandler = ([date]) => {
    if (date >= this._state.startDate) {
      this.updateElement({
        endDate: date,
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #setDatepickers = () => {
    const [dateStartElement, dateEndElement] = this.element.querySelectorAll('.event__input--time');

    this.#datepickerStart = flatpickr(dateStartElement, {
      ...FLATPICKR_CONFIG,
      defaultDate: this._state.dateStart,
      onClose: this.#closeDateStartHandler,
      maxDate: this._state.dateEnd,
    });

    this.#datepickerEnd = flatpickr(dateEndElement, {
      ...FLATPICKR_CONFIG,
      defaultDate: this._state.dateEnd,
      onClose: this.#closeDateEndHandler,
      minDate: this._state.dateStart,
    });
  };


  get parseStateToPoint() {
    return this._state;
  }
}
