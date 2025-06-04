import { RenderPosition, render, remove } from '../framework/render';
import { sort } from '../utils.js';
import { SortTypes } from '../const.js';
import HeaderView from '../view/headerView';

/**
 * Presenter class for managing the header component
 * @class HeaderPresenter
 */
class HeaderPresenter {
  /** @type {HTMLElement} */
  #container;

  /** @type {import('../model/eventsModel').default} */
  #eventsModel;

  /** @type {import('../model/destinationsModel').default} */
  #destinationsModel;

  /** @type {import('../model/offersModel').default} */
  #offersModel;

  /** @type {HeaderView|null} */
  #headerComponent;

  /**
   * Creates an instance of HeaderPresenter
   * @param {HTMLElement} container - Container element for the header
   * @param {import('../model/eventsModel').default} eventsModel - Model for events data
   * @param {import('../model/destinationsModel').default} destinationsModel - Model for destinations data
   * @param {import('../model/offersModel').default} offersModel - Model for offers data
   */
  constructor(container, eventsModel, destinationsModel, offersModel) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#eventsModel.addObserver(this.#handleEventsChange);
  }

  /**
   * Getter for events data
   * @returns {Array} Array of events
   */
  get events() {
    return this.#eventsModel.events;
  }

  /**
   * Getter for destinations data
   * @returns {Array} Array of destinations
   */
  get destinations() {
    return this.#destinationsModel.destinations;
  }

  /**
   * Getter for offers data
   * @returns {Array} Array of offers
   */
  get offers() {
    return this.#offersModel.offers;
  }

  /**
   * Initializes the header presenter
   */
  init() {
    this.#renderHeaderList();
  }

  /**
   * Handles events model changes
   * @private
   */
  #handleEventsChange = () => {
    this.#renderHeaderList();
  };

  /**
   * Renders the header list component
   * @private
   */
  #renderHeaderList() {
    if (this.#headerComponent) {
      remove(this.#headerComponent);
    }

    if (this.events.length === 0) {
      return;
    }

    this.#headerComponent = new HeaderView({
      points: sort[SortTypes.DAY](this.events),
      destinations: this.destinations,
      offers: this.offers
    });

    render(this.#headerComponent, this.#container, RenderPosition.AFTERBEGIN);
  }
}

export default HeaderPresenter;
